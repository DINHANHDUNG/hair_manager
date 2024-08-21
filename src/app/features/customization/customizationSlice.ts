import { createSlice } from '@reduxjs/toolkit'
import { config } from '../../../constants'

export interface CustomizationState {
  isOpen: string[]
  defaultId: string
  fontFamily: string
  borderRadius: number
  opened: boolean
}

const initialState: CustomizationState = {
  isOpen: [''] as Array<string>, // for active default menu
  defaultId: 'default',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true
}

const customizationSlice = createSlice({
  name: 'customization',
  initialState: initialState,
  reducers: {
    menuOpen: (state, action) => {
      const { parentId, id } = action.payload
      if (parentId) {
        state.isOpen = [parentId, id]
      } else {
        state.isOpen = [id]
      }
    },
    setMenu: (state, action) => {
      state.opened = action.payload.opened
    },
    setBorderRd: (state, action) => {
      state.borderRadius = action.payload.borderRadius
    },
    setFontFa: (state, action) => {
      state.fontFamily = action.payload.fontFamily
    }
  }
})

export const { menuOpen, setMenu, setBorderRd, setFontFa } = customizationSlice.actions

export default customizationSlice.reducer
