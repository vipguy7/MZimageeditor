import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "./fonts.css"

export const metadata: Metadata = {
  title: "YouTube Thumbnail Editor",
  description: "Create and customize YouTube thumbnails with ease",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
