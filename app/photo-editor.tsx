"use client";

import { useState, useRef, useEffect } from "react";
import { loadFont } from "@/utils/font-loader";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Add any other imports you use, e.g. icons, Tabs, etc.

export default function PhotoEditor() {
  // Text state
  const [title, setTitle] = useState("YOUR AWESOME VIDEO");
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState("#ffffff");
  const [fontWeight, setFontWeight] = useState("bold");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textAlign, setTextAlign] = useState("center");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [textY, setTextY] = useState(50);

  // Text background state
  const [textBgColor, setTextBgColor] = useState("#000000");
  const [textBgOpacity, setTextBgOpacity] = useState(0.5);

  // Custom font upload
  const [customFonts, setCustomFonts] = useState<{ name: string; url: string }[]>([]);
  const fontInputRef = useRef<HTMLInputElement>(null);

  // Duplicate text (for now, just appends " (Copy)" — for multi-layer, you'd clone the object)
  const duplicateText = () => setTitle((prev) => prev + " (Copy)");

  // Gradient overlay
  const [showGradient, setShowGradient] = useState(true);
  const [gradientOpacity, setGradientOpacity] = useState(0.7);
  const [gradientStartColor, setGradientStartColor] = useState("rgba(0,0,0,0)");
  const [gradientEndColor, setGradientEndColor] = useState("#000000");
  const [gradientDirection, setGradientDirection] = useState("bottom");
  const [gradientBlendMode, setGradientBlendMode] = useState("source-over");
  const [gradientHeight, setGradientHeight] = useState(100);

  // Logo state
  const [showLogo, setShowLogo] = useState(true);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState("bottom");
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Image/canvas state
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logo positions
  const logoPositions = [
    { value: "top", label: "Top" },
    { value: "middle", label: "Middle" },
    { value: "bottom", label: "Bottom" },
    { value: "top-left", label: "Top Left" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-right", label: "Bottom Right" },
    { value: "center", label: "Center" },
  ];

  // Font upload handler
  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fontName = file.name.replace(/\.[^/.]+$/, "");
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fontUrl = event.target?.result as string;
      await loadFont(fontName, fontUrl);
      setCustomFonts((prev) => [...prev, { name: fontName, url: fontUrl }]);
    };
    reader.readAsDataURL(file);
  };

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setLogoImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Canvas rendering
  useEffect(() => {
    renderCanvas();
    // eslint-disable-next-line
  }, [
    image, title, fontSize, fontColor, fontWeight, fontFamily, textAlign, lineHeight, textY, 
    showGradient, gradientOpacity, gradientStartColor, gradientEndColor, gradientDirection, gradientBlendMode, gradientHeight,
    showLogo, logoImage, logoPosition, textBgColor, textBgOpacity
  ]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const width = 1280, height = 720;
    canvas.width = width;
    canvas.height = height;

    // Draw image
    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Gradient overlay
      if (showGradient) {
        ctx.save();
        ctx.globalAlpha = gradientOpacity;
        const gradHeight = (height * gradientHeight) / 100;
        let gradient;
        switch (gradientDirection) {
          case "top": gradient = ctx.createLinearGradient(0, gradHeight, 0, 0); break;
          case "bottom": gradient = ctx.createLinearGradient(0, 0, 0, gradHeight); break;
          // TODO: Add more directions if you need them
          default: gradient = ctx.createLinearGradient(0, 0, 0, gradHeight);
        }
        gradient.addColorStop(0, gradientStartColor);
        gradient.addColorStop(1, gradientEndColor);
        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = gradientBlendMode as GlobalCompositeOperation;
        ctx.fillRect(0, 0, width, gradHeight);
        ctx.restore();
      }

      // Draw text background
      if (textBgOpacity > 0 && title) {
        ctx.save();
        ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;
        ctx.textAlign = textAlign as CanvasTextAlign;
        ctx.textBaseline = "middle";
        ctx.globalAlpha = textBgOpacity;
        ctx.fillStyle = textBgColor;
        const textX = width / 2;
        const textYPos = (height * textY) / 100;
        const textMetrics = ctx.measureText(title);
        const bgPadding = 12;
        let rectX = textX - textMetrics.width / 2 - bgPadding;
        if (textAlign === "left") rectX = textX - bgPadding;
        if (textAlign === "right") rectX = textX - textMetrics.width - bgPadding;
        const rectY = textYPos - fontSize / 2 - bgPadding / 2;
        ctx.fillRect(rectX, rectY, textMetrics.width + bgPadding * 2, fontSize + bgPadding);
        ctx.restore();
      }

      // Draw text
      if (title) {
        ctx.save();
        ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`;
        ctx.textAlign = textAlign as CanvasTextAlign;
        ctx.textBaseline = "middle";
        ctx.fillStyle = fontColor;
        const textX = width / 2;
        const textYPos = (height * textY) / 100;
        ctx.fillText(title, textX, textYPos);
        ctx.restore();
      }

      // Draw logo
      if (showLogo && logoImage) {
        const logo = new window.Image();
        logo.onload = () => {
          let logoW = width * 0.15;
          let logoH = logo.height * (logoW / logo.width);
          let x = 0, y = 0;
          switch (logoPosition) {
            case "top-left": x = 20; y = 20; break;
            case "top-right": x = width - logoW - 20; y = 20; break;
            case "bottom-left": x = 20; y = height - logoH - 20; break;
            case "bottom-right": x = width - logoW - 20; y = height - logoH - 20; break;
            case "top": x = (width - logoW) / 2; y = 20; break;
            case "bottom": x = (width - logoW) / 2; y = height - logoH - 20; break;
            case "center": x = (width - logoW) / 2; y = (height - logoH) / 2; break;
            case "middle": x = (width - logoW) / 2; y = height / 2 - logoH / 2; break;
            default: x = (width - logoW) / 2; y = height - logoH - 20; break;
          }
          ctx.drawImage(logo, x, y, logoW, logoH);
        };
        logo.src = logoImage;
      }
    };
    img.src = image;
  };

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
                <p className="text-gray-400 mb-4">Upload an image to get started</p>
                <Button onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        </div>
        <div>
          <div className="mb-4">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
            <Button onClick={duplicateText} className="mt-2">Duplicate Text</Button>
          </div>

          <div className="mb-4">
            <Label>Font Size</Label>
            <Slider min={10} max={150} value={[fontSize]} onValueChange={([v]) => setFontSize(v)} />
          </div>
          <div className="mb-4">
            <Label>Font Family</Label>
            <div className="flex items-center gap-2">
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Pyidaungsu">Pyidaungsu (Myanmar)</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Courier New">Courier New</SelectItem>
                  {customFonts.map((f) => (
                    <SelectItem key={f.name} value={f.name}>{f.name} (Custom)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button type="button" className="ml-2 px-2 py-1 border rounded text-xs"
                onClick={() => fontInputRef.current?.click()}>Upload Font</button>
              <input type="file" accept=".ttf,.otf,.woff,.woff2" ref={fontInputRef}
                onChange={handleFontUpload} className="hidden" />
            </div>
          </div>
          <div className="mb-4">
            <Label>Font Color</Label>
            <Input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} />
          </div>
          <div className="mb-4">
            <Label>Text Alignment</Label>
            <Select value={textAlign} onValueChange={setTextAlign}>
              <SelectTrigger>
                <SelectValue placeholder="Text Alignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label>Text Vertical Position: {textY}%</Label>
            <Slider min={0} max={100} value={[textY]} onValueChange={([v]) => setTextY(v)} />
          </div>
          <div className="mb-4 flex gap-2 items-center">
            <Label>Text BG</Label>
            <Input
              type="color"
              value={textBgColor}
              onChange={e => setTextBgColor(e.target.value)}
              className="w-8 h-8 mx-1"
            />
            <Label>Opacity</Label>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[textBgOpacity]}
              onValueChange={([v]) => setTextBgOpacity(v)}
              className="w-24"
            />
            <span className="text-xs">{Math.round(textBgOpacity * 100)}%</span>
          </div>
          <div className="mb-4">
            <Label>Show Gradient Overlay</Label>
            <Checkbox checked={showGradient} onCheckedChange={v => setShowGradient(!!v)} />
          </div>
          {showGradient && (
            <>
              <div className="mb-4">
                <Label>Gradient Opacity: {Math.round(gradientOpacity * 100)}%</Label>
                <Slider
                  value={[gradientOpacity]}
                  onValueChange={([v]) => setGradientOpacity(v)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
              <div className="mb-4">
                <Label>Gradient Height: {gradientHeight}%</Label>
                <Slider
                  value={[gradientHeight]}
                  onValueChange={([v]) => setGradientHeight(v)}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>
              <div className="mb-4">
                <Label>Start Color</Label>
                <Input type="color" value={gradientStartColor} onChange={e => setGradientStartColor(e.target.value)} />
              </div>
              <div className="mb-4">
                <Label>End Color</Label>
                <Input type="color" value={gradientEndColor} onChange={e => setGradientEndColor(e.target.value)} />
              </div>
              <div className="mb-4">
                <Label>Gradient Direction</Label>
                <Select value={gradientDirection} onValueChange={setGradientDirection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom">Top to Bottom</SelectItem>
                    <SelectItem value="top">Bottom to Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div className="mb-4">
            <Label>Show Logo</Label>
            <Checkbox checked={showLogo} onCheckedChange={v => setShowLogo(!!v)} />
          </div>
          {showLogo && (
            <>
              <div className="mb-4">
                <Label>Logo Image</Label>
                <div className="flex gap-2 items-center">
                  <Button onClick={() => logoInputRef.current?.click()}>Upload Logo</Button>
                  {logoImage && <img src={logoImage} alt="Logo" className="h-12" />}
                  <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>
              <div className="mb-4">
                <Label>Logo Position</Label>
                <Select value={logoPosition} onValueChange={setLogoPosition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {logoPositions.map(pos => (
                      <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
