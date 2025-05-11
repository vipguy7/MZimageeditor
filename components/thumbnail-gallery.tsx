"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Share2, Download, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { deleteThumbnail } from "@/app/actions"
import type { SavedThumbnail } from "@/app/actions"

export function ThumbnailGallery({
  savedThumbnails,
  onSelectThumbnail,
}: {
  savedThumbnails: SavedThumbnail[]
  onSelectThumbnail?: (url: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [thumbnails, setThumbnails] = useState<SavedThumbnail[]>(savedThumbnails)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  useEffect(() => {
    setThumbnails(savedThumbnails)
  }, [savedThumbnails])

  const handleDelete = async (id: string) => {
    const result = await deleteThumbnail(id)

    if (result.success) {
      setThumbnails(thumbnails.filter((thumbnail) => thumbnail.id !== id))
      toast({
        title: "Thumbnail deleted",
        description: "The thumbnail has been removed from your gallery.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete thumbnail",
        variant: "destructive",
      })
    }
  }

  const handleShare = (url: string) => {
    setShareUrl(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Link copied",
      description: "The thumbnail link has been copied to your clipboard.",
    })
  }

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = `${title || "thumbnail"}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSelectThumbnail = (url: string) => {
    if (onSelectThumbnail) {
      onSelectThumbnail(url)
      setOpen(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">View Gallery</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Saved Thumbnails</DialogTitle>
          </DialogHeader>

          {shareUrl ? (
            <div className="p-4 border rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Share Thumbnail</h3>
                <Button variant="ghost" size="icon" onClick={() => setShareUrl(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 border rounded-md text-sm" />
                <Button onClick={() => copyToClipboard(shareUrl)}>Copy</Button>
              </div>
            </div>
          ) : thumbnails.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {thumbnails.map((thumbnail) => (
                <Card key={thumbnail.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={thumbnail.url || "/placeholder.svg"}
                      alt={thumbnail.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleSelectThumbnail(thumbnail.url)}
                    />
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium truncate" title={thumbnail.title}>
                        {thumbnail.title || "Untitled"}
                      </p>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleShare(thumbnail.url)} title="Share">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(thumbnail.url, thumbnail.title)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(thumbnail.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{new Date(thumbnail.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't saved any thumbnails yet.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
