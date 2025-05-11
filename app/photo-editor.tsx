"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ImageIcon,
  Type,
  Palette,
  Crop,
  Download,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
} from "lucide-react"
import { loadFont } from "@/utils/font-loader"
import { ThumbnailGallery } from "@/components/thumbnail-gallery"
import { Toaster } from "@/components/toaster"
import { toast } from "@/components/ui/use-toast"
import { saveThumbnail } from "./actions"
import type { SavedThumbnail } from "./actions"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TextEffectPresets } from "@/components/text-effect-presets"
import type { TextEffectPreset } from "@/app/text-effect-presets"

// Web color presets
const webColors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
  { name: "Yellow", value: "#ffff00" },
  { name: "Cyan", value: "#00ffff" },
  { name: "Magenta", value: "#ff00ff" },
  { name: "Orange", value: "#ff8800" },
  { name: "Purple", value: "#8800ff" },
  { name: "Pink", value: "#ff88cc" },
  { name: "Teal", value: "#008888" },
]

// Blend modes
const blendModes = [
  { name: "Normal", value: "source-over" },
  { name: "Multiply", value: "multiply" },
  { name: "Screen", value: "screen" },
  { name: "Overlay", value: "overlay" },
  { name: "Darken", value: "darken" },
  { name: "Lighten", value: "lighten" },
  { name: "Color Dodge", value: "color-dodge" },
  { name: "Color Burn", value: "color-burn" },
  { name: "Hard Light", value: "hard-light" },
  { name: "Soft Light", value: "soft-light" },
  { name: "Difference", value: "difference" },
  { name: "Exclusion", value: "exclusion" },
  { name: "Hue", value: "hue" },
  { name: "Saturation", value: "saturation" },
  { name: "Color", value: "color" },
  { name: "Luminosity", value: "luminosity" },
]

export default function PhotoEditor({ savedThumbnails }: { savedThumbnails: SavedThumbnail[] }) {
  const [image, setImage] = useState<string | null>(null)
  const [title, setTitle] = useState("YOUR AWESOME VIDEO")
  const [fontSize, setFontSize] = useState(48)
  const [fontColor, setFontColor] = useState("#ffffff")
  const [fontWeight, setFontWeight] = useState("bold")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [textAlign, setTextAlign] = useState("center")
  const [lineHeight, setLineHeight] = useState(1.2)
  const [textY, setTextY] = useState(50)
  const [showGradient, setShowGradient] = useState(true)
  const [gradientOpacity, setGradientOpacity] = useState(0.7)
  const [showLogo, setShowLogo] = useState(true)
  const [logoPosition, setLogoPosition] = useState("bottom")
  const [cropSize, setCropSize] = useState("16:9")
  const [logoImage, setLogoImage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Enhanced gradient settings
  const [gradientStartColor, setGradientStartColor] = useState("rgba(0, 0, 0, 0)")
  const [gradientEndColor, setGradientEndColor] = useState("#000000")
  const [gradientDirection, setGradientDirection] = useState("bottom")
  const [gradientBlendMode, setGradientBlendMode] = useState("source-over")

  // Text stroke (outline) settings
  const [enableStroke, setEnableStroke] = useState(false)
  const [strokeColor, setStrokeColor] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState(3)

  // Text shadow settings
  const [enableShadow, setEnableShadow] = useState(false)
  const [shadowColor, setShadowColor] = useState("#000000")
  const [shadowBlur, setShadowBlur] = useState(5)
  const [shadowOffsetX, setShadowOffsetX] = useState(2)
  const [shadowOffsetY, setShadowOffsetY] = useState(2)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const cropDimensions = {
    square: { width: 1500, height: 1500 },
    "4:5": { width: 1200, height: 1500 },
    "5:4": { width: 1500, height: 1200 },
    "16:9": { width: 1920, height: 1080 },
  }

  useEffect(() => {
    loadFont("Pyidaungsu", "/fonts/Pyidaungsu.ttf")
      .then(() => {
        console.log("Pyidaungsu font loaded successfully")
      })
      .catch((error) => {
        console.error("Failed to load Pyidaungsu font:", error)
      })
  }, [])

  useEffect(() => {
    if (image) {
      renderCanvas()
    }
  }, [
    image,
    title,
    fontSize,
    fontColor,
    fontWeight,
    fontFamily,
    textAlign,
    lineHeight,
    textY,
    showGradient,
    gradientOpacity,
    gradientStartColor,
    gradientEndColor,
    gradientDirection,
    gradientBlendMode,
    showLogo,
    logoPosition,
    cropSize,
    logoImage,
    enableStroke,
    strokeColor,
    strokeWidth,
    enableShadow,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
  ])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const createGradient = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    let gradient

    switch (gradientDirection) {
      case "top":
        gradient = ctx.createLinearGradient(0, height, 0, 0)
        break
      case "left":
        gradient = ctx.createLinearGradient(width, 0, 0, 0)
        break
      case "right":
        gradient = ctx.createLinearGradient(0, 0, width, 0)
        break
      case "topLeft":
        gradient = ctx.createLinearGradient(width, height, 0, 0)
        break
      case "topRight":
        gradient = ctx.createLinearGradient(0, height, width, 0)
        break
      case "bottomLeft":
        gradient = ctx.createLinearGradient(width, 0, 0, height)
        break
      case "bottomRight":
        gradient = ctx.createLinearGradient(0, 0, width, height)
        break
      case "radial":
        gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          0,
          width / 2,
          height / 2,
          Math.max(width, height) / 2,
        )
        break
      default: // bottom (default)
        gradient = ctx.createLinearGradient(0, 0, 0, height)
        break
    }

    // Add color stops
    gradient.addColorStop(0, gradientStartColor)
    gradient.addColorStop(1, adjustColorOpacity(gradientEndColor, gradientOpacity))

    return gradient
  }

  const adjustColorOpacity = (color: string, opacity: number) => {
    // If color is already in rgba format
    if (color.startsWith("rgba")) {
      return color.replace(/rgba$$(.+?),\s*[\d.]+$$/, `rgba($1, ${opacity})`)
    }

    // If color is in rgb format
    if (color.startsWith("rgb")) {
      return color.replace(/rgb$$(.+?)$$/, `rgba($1, ${opacity})`)
    }

    // If color is in hex format
    if (color.startsWith("#")) {
      const r = Number.parseInt(color.slice(1, 3), 16)
      const g = Number.parseInt(color.slice(3, 5), 16)
      const b = Number.parseInt(color.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }

    // Default fallback
    return `rgba(0, 0, 0, ${opacity})`
  }

  const renderCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = cropDimensions[cropSize as keyof typeof cropDimensions]
    canvas.width = width
    canvas.height = height

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Calculate dimensions to maintain aspect ratio while filling canvas
      const imgRatio = img.width / img.height
      const canvasRatio = width / height

      let drawWidth,
        drawHeight,
        offsetX = 0,
        offsetY = 0

      if (imgRatio > canvasRatio) {
        // Image is wider than canvas ratio
        drawHeight = height
        drawWidth = height * imgRatio
        offsetX = (width - drawWidth) / 2
      } else {
        // Image is taller than canvas ratio
        drawWidth = width
        drawHeight = width / imgRatio
        offsetY = (height - drawHeight) / 2
      }

      // Draw image
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

      // Add gradient overlay
      if (showGradient) {
        // Save the current state
        ctx.save()

        // Set blend mode
        ctx.globalCompositeOperation = gradientBlendMode as GlobalCompositeOperation

        // Create and apply gradient
        const gradient = createGradient(ctx, width, height)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Restore to previous state
        ctx.restore()
      }

      // Add text
      ctx.textAlign = textAlign as CanvasTextAlign
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}, Arial, sans-serif`

      // Handle text wrapping
      const maxWidth = width * 0.9
      const words = title.split(" ")
      const lines = []
      let currentLine = words[0]

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + " " + words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth) {
          lines.push(currentLine)
          currentLine = words[i]
        } else {
          currentLine = testLine
        }
      }
      lines.push(currentLine)

      // Calculate text position
      const textX = textAlign === "left" ? width * 0.05 : textAlign === "right" ? width * 0.95 : width / 2

      const lineHeightPx = fontSize * lineHeight
      const totalTextHeight = lineHeightPx * lines.length
      const textStartY = (height * textY) / 100 - totalTextHeight / 2

      // Apply shadow if enabled
      if (enableShadow) {
        ctx.shadowColor = shadowColor
        ctx.shadowBlur = shadowBlur
        ctx.shadowOffsetX = shadowOffsetX
        ctx.shadowOffsetY = shadowOffsetY
      } else {
        // Reset shadow
        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }

      // Draw text lines
      lines.forEach((line, index) => {
        const y = textStartY + index * lineHeightPx

        if (enableStroke) {
          // Draw text stroke (outline)
          ctx.strokeStyle = strokeColor
          ctx.lineWidth = strokeWidth
          ctx.lineJoin = "round" // Makes the corners smoother
          ctx.strokeText(line, textX, y)
        }

        // Draw text fill
        ctx.fillStyle = fontColor
        ctx.fillText(line, textX, y)
      })

      // Reset shadow for the rest of the rendering
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Add logo
      if (showLogo && logoImage) {
        const logo = new Image()
        logo.crossOrigin = "anonymous"
        logo.onload = () => {
          const logoWidth = width * 0.2
          const logoHeight = (logo.height / logo.width) * logoWidth

          const logoX = (width - logoWidth) / 2
          let logoY

          if (logoPosition === "top") {
            logoY = height * 0.05
          } else if (logoPosition === "middle") {
            logoY = (height - logoHeight) / 2
          } else {
            logoY = height * 0.95 - logoHeight
          }

          ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)

          // Add blue lines beside logo if at bottom
          if (logoPosition === "bottom") {
            const lineY = logoY + logoHeight / 2
            const lineLength = logoWidth * 0.8
            const lineGap = logoWidth * 0.1

            ctx.strokeStyle = "#3b82f6"
            ctx.lineWidth = 3

            // Left line
            ctx.beginPath()
            ctx.moveTo(logoX - lineGap, lineY)
            ctx.lineTo(logoX - lineGap - lineLength, lineY)
            ctx.stroke()

            // Right line
            ctx.beginPath()
            ctx.moveTo(logoX + logoWidth + lineGap, lineY)
            ctx.lineTo(logoX + logoWidth + lineGap + lineLength, lineY)
            ctx.stroke()
          }
        }
        logo.src = logoImage
      }
    }
    img.src = image
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "youtube-thumbnail.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const saveToBlob = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsSaving(true)

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, "image/png")
      })

      // Create a File object from the blob
      const file = new File([blob], "thumbnail.png", { type: "image/png" })

      // Create FormData
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)

      // Save to Blob store
      const result = await saveThumbnail(formData)

      if (result.success) {
        toast({
          title: "Thumbnail saved",
          description: "Your thumbnail has been saved to the cloud.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save thumbnail",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving thumbnail:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving your thumbnail.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectThumbnail = (url: string) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(url)
    }
    img.src = url
  }

  const handleSelectPreset = (preset: TextEffectPreset) => {
    // Apply the preset settings
    setFontColor(preset.settings.fontColor)
    setEnableStroke(preset.settings.enableStroke)
    setStrokeColor(preset.settings.strokeColor)
    setStrokeWidth(preset.settings.strokeWidth)
    setEnableShadow(preset.settings.enableShadow)
    setShadowColor(preset.settings.shadowColor)
    setShadowBlur(preset.settings.shadowBlur)
    setShadowOffsetX(preset.settings.shadowOffsetX)
    setShadowOffsetY(preset.settings.shadowOffsetY)

    toast({
      title: `Applied "${preset.name}" preset`,
      description: preset.description,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">YouTube Thumbnail Editor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
            {image ? (
              <canvas ref={canvasRef} className="max-w-full max-h-[70vh] object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center h-[70vh] w-full border-2 border-dashed border-gray-400 rounded-lg">
                <ImageIcon size={64} className="text-gray-400 mb-4" />
                <p className="text-gray-400 mb-4">Upload an image to get started</p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Image
                </Button>
              </div>
            )}
          </div>

          {image && (
            <div className="flex justify-center mt-4 gap-4 flex-wrap">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Change Image
              </Button>
              <Button onClick={downloadImage} variant="secondary">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button onClick={saveToBlob} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save to Cloud"}
              </Button>
              <ThumbnailGallery savedThumbnails={savedThumbnails} onSelectThumbnail={handleSelectThumbnail} />
            </div>
          )}

          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
        </div>

        <div>
          <Tabs defaultValue="text">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="crop">
                <Crop className="h-4 w-4 mr-2" /> Crop
              </TabsTrigger>
              <TabsTrigger value="text">
                <Type className="h-4 w-4 mr-2" /> Text
              </TabsTrigger>
              <TabsTrigger value="gradient">
                <Palette className="h-4 w-4 mr-2" /> Gradient
              </TabsTrigger>
              <TabsTrigger value="logo">
                <ImageIcon className="h-4 w-4 mr-2" /> Logo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="crop">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Thumbnail Size</Label>
                      <Select value={cropSize} onValueChange={setCropSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16:9">YouTube (16:9) - 1920×1080</SelectItem>
                          <SelectItem value="square">Square - 1500×1500</SelectItem>
                          <SelectItem value="4:5">Portrait - 1200×1500</SelectItem>
                          <SelectItem value="5:4">Landscape - 1500×1200</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="text">
              <Card>
                <CardContent className="pt-6">
                  {/* Text Effect Presets */}
                  <div className="mb-6">
                    <TextEffectPresets onSelectPreset={handleSelectPreset} />
                  </div>

                  <Accordion type="single" collapsible defaultValue="text-basic">
                    <AccordionItem value="text-basic">
                      <AccordionTrigger>Basic Text Settings</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <Label>Title Text</Label>
                            <Input
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Enter title text"
                            />
                          </div>

                          <div>
                            <Label>Font Size: {fontSize}px</Label>
                            <Slider
                              value={[fontSize]}
                              onValueChange={(value) => setFontSize(value[0])}
                              min={20}
                              max={120}
                              step={1}
                            />
                          </div>

                          <div>
                            <Label>Line Height: {lineHeight.toFixed(1)}</Label>
                            <Slider
                              value={[lineHeight * 10]}
                              onValueChange={(value) => setLineHeight(value[0] / 10)}
                              min={10}
                              max={20}
                              step={1}
                            />
                          </div>

                          <div>
                            <Label>Text Position: {textY}%</Label>
                            <Slider
                              value={[textY]}
                              onValueChange={(value) => setTextY(value[0])}
                              min={10}
                              max={90}
                              step={1}
                            />
                          </div>

                          <div>
                            <Label>Font Color</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={fontColor}
                                onChange={(e) => setFontColor(e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={fontColor}
                                onChange={(e) => setFontColor(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Font Weight</Label>
                            <Select value={fontWeight} onValueChange={setFontWeight}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select weight" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="bold">Bold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Font Family</Label>
                            <Select value={fontFamily} onValueChange={setFontFamily}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select font" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Pyidaungsu">Pyidaungsu (Myanmar)</SelectItem>
                                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                <SelectItem value="Courier New">Courier New</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Text Alignment</Label>
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant={textAlign === "left" ? "default" : "outline"}
                                onClick={() => setTextAlign("left")}
                                size="icon"
                              >
                                <AlignLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={textAlign === "center" ? "default" : "outline"}
                                onClick={() => setTextAlign("center")}
                                size="icon"
                              >
                                <AlignCenter className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={textAlign === "right" ? "default" : "outline"}
                                onClick={() => setTextAlign("right")}
                                size="icon"
                              >
                                <AlignRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="text-stroke">
                      <AccordionTrigger>Text Outline</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="enable-stroke"
                              checked={enableStroke}
                              onCheckedChange={(checked) => setEnableStroke(checked === true)}
                            />
                            <Label htmlFor="enable-stroke">Enable Text Outline</Label>
                          </div>

                          {enableStroke && (
                            <>
                              <div>
                                <Label>Outline Color</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="color"
                                    value={strokeColor}
                                    onChange={(e) => setStrokeColor(e.target.value)}
                                    className="w-12 h-10 p-1"
                                  />
                                  <Input
                                    value={strokeColor}
                                    onChange={(e) => setStrokeColor(e.target.value)}
                                    className="flex-1"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label>Outline Width: {strokeWidth}px</Label>
                                <Slider
                                  value={[strokeWidth]}
                                  onValueChange={(value) => setStrokeWidth(value[0])}
                                  min={1}
                                  max={10}
                                  step={1}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="text-shadow">
                      <AccordionTrigger>Text Shadow</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="enable-shadow"
                              checked={enableShadow}
                              onCheckedChange={(checked) => setEnableShadow(checked === true)}
                            />
                            <Label htmlFor="enable-shadow">Enable Text Shadow</Label>
                          </div>

                          {enableShadow && (
                            <>
                              <div>
                                <Label>Shadow Color</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="color"
                                    value={shadowColor}
                                    onChange={(e) => setShadowColor(e.target.value)}
                                    className="w-12 h-10 p-1"
                                  />
                                  <Input
                                    value={shadowColor}
                                    onChange={(e) => setShadowColor(e.target.value)}
                                    className="flex-1"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label>Shadow Blur: {shadowBlur}px</Label>
                                <Slider
                                  value={[shadowBlur]}
                                  onValueChange={(value) => setShadowBlur(value[0])}
                                  min={0}
                                  max={20}
                                  step={1}
                                />
                              </div>

                              <div>
                                <Label>Shadow Offset X: {shadowOffsetX}px</Label>
                                <Slider
                                  value={[shadowOffsetX]}
                                  onValueChange={(value) => setShadowOffsetX(value[0])}
                                  min={-20}
                                  max={20}
                                  step={1}
                                />
                              </div>

                              <div>
                                <Label>Shadow Offset Y: {shadowOffsetY}px</Label>
                                <Slider
                                  value={[shadowOffsetY]}
                                  onValueChange={(value) => setShadowOffsetY(value[0])}
                                  min={-20}
                                  max={20}
                                  step={1}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gradient">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Show Gradient Overlay</Label>
                      <Checkbox
                        checked={showGradient}
                        onCheckedChange={(checked) => setShowGradient(checked === true)}
                      />
                    </div>

                    {showGradient && (
                      <>
                        <div>
                          <Label>Gradient Opacity: {Math.round(gradientOpacity * 100)}%</Label>
                          <Slider
                            value={[gradientOpacity * 100]}
                            onValueChange={(value) => setGradientOpacity(value[0] / 100)}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>

                        <div>
                          <Label>Start Color</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              value={gradientStartColor.startsWith("rgba") ? "#000000" : gradientStartColor}
                              onChange={(e) => setGradientStartColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Select value={gradientStartColor} onValueChange={setGradientStartColor}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rgba(0, 0, 0, 0)">Transparent</SelectItem>
                                {webColors.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center">
                                      <div
                                        className="w-4 h-4 mr-2 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color.value }}
                                      />
                                      {color.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>End Color</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="color"
                              value={gradientEndColor}
                              onChange={(e) => setGradientEndColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Select value={gradientEndColor} onValueChange={setGradientEndColor}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                              <SelectContent>
                                {webColors.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center">
                                      <div
                                        className="w-4 h-4 mr-2 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color.value }}
                                      />
                                      {color.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Gradient Direction</Label>
                          <Select value={gradientDirection} onValueChange={setGradientDirection}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bottom">Top to Bottom</SelectItem>
                              <SelectItem value="top">Bottom to Top</SelectItem>
                              <SelectItem value="right">Left to Right</SelectItem>
                              <SelectItem value="left">Right to Left</SelectItem>
                              <SelectItem value="bottomRight">Top-Left to Bottom-Right</SelectItem>
                              <SelectItem value="bottomLeft">Top-Right to Bottom-Left</SelectItem>
                              <SelectItem value="topRight">Bottom-Left to Top-Right</SelectItem>
                              <SelectItem value="topLeft">Bottom-Right to Top-Left</SelectItem>
                              <SelectItem value="radial">Radial (Center)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Blend Mode</Label>
                          <Select value={gradientBlendMode} onValueChange={setGradientBlendMode}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blend mode" />
                            </SelectTrigger>
                            <SelectContent>
                              {blendModes.map((mode) => (
                                <SelectItem key={mode.value} value={mode.value}>
                                  {mode.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logo">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Show Logo</Label>
                      <Checkbox checked={showLogo} onCheckedChange={(checked) => setShowLogo(checked === true)} />
                    </div>

                    {showLogo && (
                      <>
                        <div>
                          <Label>Logo Position</Label>
                          <Select value={logoPosition} onValueChange={setLogoPosition}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="top">Top</SelectItem>
                              <SelectItem value="middle">Middle</SelectItem>
                              <SelectItem value="bottom">Bottom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Logo Image</Label>
                          <div className="mt-2">
                            {logoImage ? (
                              <div className="flex flex-col items-center gap-2">
                                <img
                                  src={logoImage || "/placeholder.svg"}
                                  alt="Logo"
                                  className="h-16 object-contain mb-2"
                                />
                                <Button onClick={() => logoInputRef.current?.click()} variant="outline" size="sm">
                                  Change Logo
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => logoInputRef.current?.click()}
                                variant="outline"
                                className="w-full"
                              >
                                <Upload className="mr-2 h-4 w-4" /> Upload Logo
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
