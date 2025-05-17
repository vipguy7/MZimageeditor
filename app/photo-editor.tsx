"use client";

import { useState, useRef, useEffect } from "react";
import { loadFont } from "@/utils/font-loader";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ... (all your state and handlers remain the same)

export default function PhotoEditor() {
  // ... all your state & handlers

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-100 py-10">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 px-4">
        {/* Editor Preview */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white/70 shadow-lg rounded-xl p-4 flex items-center justify-center min-h-[420px]">
            {image ? (
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[70vh] object-contain rounded-lg border border-gray-300 shadow"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] w-full border-2 border-dashed border-gray-300 rounded-xl bg-white/40">
                <p className="text-gray-400 mb-4">Upload an image to get started</p>
                <Button onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        {/* Controls Panel */}
        <aside className="w-full lg:w-1/3">
          <div className="sticky top-8 bg-white/90 rounded-xl shadow-lg p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
            {/* Title */}
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} className="mb-2" />
              <Button onClick={duplicateText} size="sm">Duplicate Text</Button>
            </div>
            {/* Font Controls */}
            <div>
              <Label>Font Size</Label>
              <Slider min={10} max={150} value={[fontSize]} onValueChange={([v]) => setFontSize(v)} />
            </div>
            <div>
              <Label>Font Family</Label>
              <div className="flex gap-2">
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger><SelectValue placeholder="Select font" /></SelectTrigger>
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
                <Button variant="outline" size="sm" onClick={() => fontInputRef.current?.click()}>
                  Upload Font
                </Button>
                <input type="file" accept=".ttf,.otf,.woff,.woff2" ref={fontInputRef} onChange={handleFontUpload} className="hidden" />
              </div>
            </div>
            <div>
              <Label>Font Color</Label>
              <Input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} className="w-12 h-8 p-0 border-none bg-transparent" />
            </div>
            <div>
              <Label>Text Alignment</Label>
              <Select value={textAlign} onValueChange={setTextAlign}>
                <SelectTrigger><SelectValue placeholder="Text Alignment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Text Vertical Position: {textY}%</Label>
              <Slider min={0} max={100} value={[textY]} onValueChange={([v]) => setTextY(v)} />
            </div>
            {/* Text BG */}
            <div className="flex gap-2 items-center">
              <Label>Text BG</Label>
              <Input type="color" value={textBgColor} onChange={e => setTextBgColor(e.target.value)} className="w-8 h-8 p-0 border-none bg-transparent" />
              <Label>Opacity</Label>
              <Slider min={0} max={1} step={0.01} value={[textBgOpacity]} onValueChange={([v]) => setTextBgOpacity(v)} className="w-24" />
              <span className="text-xs">{Math.round(textBgOpacity * 100)}%</span>
            </div>
            {/* Gradient */}
            <div>
              <div className="flex items-center gap-2">
                <Label>Show Gradient Overlay</Label>
                <Checkbox checked={showGradient} onCheckedChange={v => setShowGradient(!!v)} />
              </div>
              {showGradient && (
                <>
                  <Label>Gradient Opacity: {Math.round(gradientOpacity * 100)}%</Label>
                  <Slider value={[gradientOpacity]} onValueChange={([v]) => setGradientOpacity(v)} min={0} max={1} step={0.01} />
                  <Label>Gradient Height: {gradientHeight}%</Label>
                  <Slider value={[gradientHeight]} onValueChange={([v]) => setGradientHeight(v)} min={1} max={100} step={1} />
                  <div className="flex gap-2">
                    <Label>Start Color</Label>
                    <Input type="color" value={gradientStartColor} onChange={e => setGradientStartColor(e.target.value)} className="w-8 h-8 p-0 border-none bg-transparent" />
                  </div>
                  <div className="flex gap-2">
                    <Label>End Color</Label>
                    <Input type="color" value={gradientEndColor} onChange={e => setGradientEndColor(e.target.value)} className="w-8 h-8 p-0 border-none bg-transparent" />
                  </div>
                  <Label>Gradient Direction</Label>
                  <Select value={gradientDirection} onValueChange={setGradientDirection}>
                    <SelectTrigger><SelectValue placeholder="Select direction" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom">Top to Bottom</SelectItem>
                      <SelectItem value="top">Bottom to Top</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Label>Show Logo</Label>
              <Checkbox checked={showLogo} onCheckedChange={v => setShowLogo(!!v)} />
            </div>
            {showLogo && (
              <>
                <div className="flex gap-2 items-center">
                  <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
                    Upload Logo
                  </Button>
                  {logoImage && <img src={logoImage} alt="Logo" className="h-10 rounded shadow" />}
                  <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" />
                </div>
                <Label>Logo Position</Label>
                <Select value={logoPosition} onValueChange={setLogoPosition}>
                  <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                  <SelectContent>
                    {logoPositions.map(pos => (
                      <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
