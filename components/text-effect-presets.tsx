"use client"

import { useState } from "react"
import { type TextEffectPreset, textEffectPresets } from "@/app/text-effect-presets"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TextEffectPresetsProps {
  onSelectPreset: (preset: TextEffectPreset) => void
}

export function TextEffectPresets({ onSelectPreset }: TextEffectPresetsProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)

  const handleSelectPreset = (preset: TextEffectPreset) => {
    setSelectedPresetId(preset.id)
    onSelectPreset(preset)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Text Effect Presets</h3>
      <ScrollArea className="h-[120px] rounded-md border">
        <div className="flex gap-2 p-3">
          {textEffectPresets.map((preset) => (
            <Button
              key={preset.id}
              variant={selectedPresetId === preset.id ? "default" : "outline"}
              className="flex flex-col h-auto py-2 px-3 gap-1"
              onClick={() => handleSelectPreset(preset)}
            >
              <span
                className="text-lg font-bold"
                style={{
                  color: preset.settings.fontColor,
                  textShadow: preset.settings.enableShadow
                    ? `${preset.settings.shadowOffsetX}px ${preset.settings.shadowOffsetY}px ${preset.settings.shadowBlur}px ${preset.settings.shadowColor}`
                    : "none",
                  WebkitTextStroke: preset.settings.enableStroke
                    ? `${preset.settings.strokeWidth / 3}px ${preset.settings.strokeColor}`
                    : "none",
                }}
              >
                {preset.preview}
              </span>
              <span className="text-xs">{preset.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
