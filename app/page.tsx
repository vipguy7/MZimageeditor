import { getSavedThumbnails } from "./actions"
import PhotoEditor from "./photo-editor"

export default async function Home() {
  const savedThumbnails = await getSavedThumbnails()

  return (
    <main>
      <PhotoEditor savedThumbnails={savedThumbnails} />
    </main>
  )
}
