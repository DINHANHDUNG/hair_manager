import { createSlice } from '@reduxjs/toolkit'
// import config from 'config';

const initialState = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  // fontFamily: config.fontFamily,
  // borderRadius: config.borderRadius,
  opened: true
}

const customizationSlice = createSlice({
  name: 'customization',
  initialState: initialState,
  reducers: {
    menuOpen: (state, action) => {
      state.isOpen = action.payload.id
    }
  }
})

export const { menuOpen } = customizationSlice.actions

export default customizationSlice.reducer
