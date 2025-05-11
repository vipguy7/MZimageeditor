"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Type for saved thumbnails
export type SavedThumbnail = {
  id: string
  url: string
  title: string
  createdAt: string
}

// Save thumbnail to Blob store
export async function saveThumbnail(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const title = (formData.get("title") as string) || "Untitled"

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Generate a unique ID for the thumbnail
    const id = uuidv4()

    // Upload to Blob store
    const blob = await put(`thumbnails/${id}.png`, file, {
      access: "public",
      contentType: file.type,
    })

    // Get existing thumbnails from cookies
    const cookieStore = cookies()
    const savedThumbnailsCookie = cookieStore.get("savedThumbnails")
    const savedThumbnails: SavedThumbnail[] = savedThumbnailsCookie ? JSON.parse(savedThumbnailsCookie.value) : []

    // Add new thumbnail to the list
    const newThumbnail: SavedThumbnail = {
      id,
      url: blob.url,
      title,
      createdAt: new Date().toISOString(),
    }

    // Add to the beginning of the array (most recent first)
    savedThumbnails.unshift(newThumbnail)

    // Store only the last 20 thumbnails to avoid cookie size limits
    const limitedThumbnails = savedThumbnails.slice(0, 20)

    // Save to cookies
    cookieStore.set("savedThumbnails", JSON.stringify(limitedThumbnails), {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    revalidatePath("/")

    return {
      success: true,
      url: blob.url,
      id,
    }
  } catch (error) {
    console.error("Error saving thumbnail:", error)
    return { success: false, error: "Failed to save thumbnail" }
  }
}

// Get saved thumbnails from cookies
export async function getSavedThumbnails(): Promise<SavedThumbnail[]> {
  const cookieStore = cookies()
  const savedThumbnailsCookie = cookieStore.get("savedThumbnails")

  if (!savedThumbnailsCookie) {
    return []
  }

  try {
    return JSON.parse(savedThumbnailsCookie.value) as SavedThumbnail[]
  } catch (error) {
    console.error("Error parsing saved thumbnails:", error)
    return []
  }
}

// Delete a thumbnail from cookies (we can't delete from Blob store on the client)
export async function deleteThumbnail(id: string) {
  const cookieStore = cookies()
  const savedThumbnailsCookie = cookieStore.get("savedThumbnails")

  if (!savedThumbnailsCookie) {
    return { success: false, error: "No saved thumbnails found" }
  }

  try {
    const savedThumbnails: SavedThumbnail[] = JSON.parse(savedThumbnailsCookie.value)
    const updatedThumbnails = savedThumbnails.filter((thumbnail) => thumbnail.id !== id)

    cookieStore.set("savedThumbnails", JSON.stringify(updatedThumbnails), {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting thumbnail:", error)
    return { success: false, error: "Failed to delete thumbnail" }
  }
}
