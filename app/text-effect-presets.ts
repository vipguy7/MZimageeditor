// Text effect presets for the thumbnail editor
export interface TextEffectPreset {
  id: string
  name: string
  description: string
  preview: string
  settings: {
    fontColor: string
    enableStroke: boolean
    strokeColor: string
    strokeWidth: number
    enableShadow: boolean
    shadowColor: string
    shadowBlur: number
    shadowOffsetX: number
    shadowOffsetY: number
  }
}

export const textEffectPresets: TextEffectPreset[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean text with no effects",
    preview: "Aa",
    settings: {
      fontColor: "#ffffff",
      enableStroke: false,
      strokeColor: "#000000",
      strokeWidth: 0,
      enableShadow: false,
      shadowColor: "#000000",
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
  },
  {
    id: "bold-outline",
    name: "Bold Outline",
    description: "White text with thick black outline",
    preview: "Aa",
    settings: {
      fontColor: "#ffffff",
      enableStroke: true,
      strokeColor: "#000000",
      strokeWidth: 5,
      enableShadow: false,
      shadowColor: "#000000",
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
  },
  {
    id: "subtle-shadow",
    name: "Subtle Shadow",
    description: "White text with soft shadow",
    preview: "Aa",
    settings: {
      fontColor: "#ffffff",
      enableStroke: false,
      strokeColor: "#000000",
      strokeWidth: 0,
      enableShadow: true,
      shadowColor: "rgba(0,0,0,0.7)",
      shadowBlur: 5,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
    },
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Bright text with colorful glow effect",
    preview: "Aa",
    settings: {
      fontColor: "#00ffff",
      enableStroke: true,
      strokeColor: "#0000ff",
      strokeWidth: 2,
      enableShadow: true,
      shadowColor: "#00ffff",
      shadowBlur: 15,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
  },
  {
    id: "fire-text",
    name: "Fire Text",
    description: "Red-orange text with fiery glow",
    preview: "Aa",
    settings: {
      fontColor: "#ff9900",
      enableStroke: true,
      strokeColor: "#ff0000",
      strokeWidth: 2,
      enableShadow: true,
      shadowColor: "#ff0000",
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
  },
  {
    id: "retro-gaming",
    name: "Retro Gaming",
    description: "Pixelated-style text effect",
    preview: "Aa",
    settings: {
      fontColor: "#33ff33",
      enableStroke: true,
      strokeColor: "#003300",
      strokeWidth: 3,
      enableShadow: true,
      shadowColor: "#003300",
      shadowBlur: 1,
      shadowOffsetX: 3,
      shadowOffsetY: 3,
    },
  },
  {
    id: "dramatic",
    name: "Dramatic",
    description: "Bold text with strong shadow",
    preview: "Aa",
    settings: {
      fontColor: "#ffffff",
      enableStroke: true,
      strokeColor: "#000000",
      strokeWidth: 3,
      enableShadow: true,
      shadowColor: "#000000",
      shadowBlur: 5,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    },
  },
  {
    id: "comic-book",
    name: "Comic Book",
    description: "Yellow text with comic-style outline",
    preview: "Aa",
    settings: {
      fontColor: "#ffff00",
      enableStroke: true,
      strokeColor: "#000000",
      strokeWidth: 4,
      enableShadow: false,
      shadowColor: "#000000",
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
  },
]
