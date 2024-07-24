// types/palette.d.ts
import { Palette, PaletteOptions, PaletteColor } from '@mui/material'

interface orange {
  light: string
  main: string
  dark: string
}

// Mở rộng kiểu Palette để thêm màu mới
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    primary: PaletteColor & {
      200?: string // Thêm màu tùy chỉnh
      800?: string
    }
    orange: PaletteColor & orange
  }

  interface PaletteOptions {
    primary?: PaletteOptions & {
      200?: string // Thêm màu tùy chỉnh
      800?: string
    }
    orange?: PaletteOptions & orange
  }

  interface PaletteColor {
    200?: string // Thêm màu tùy chỉnh vào PaletteColor
    800?: string
    light?: string
    main?: string
    dark?: string
  }
}
