import { createSlice } from "@reduxjs/toolkit";
import { UiState } from "../interfaces";

const initialState: UiState = {
  openDrawerChat: false,
  openDrawerSidebar: false,
  openDrawerSidebarMobile: false,
  
};
export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    onSliceToogleDrawerChat: (state) => {
      state.openDrawerChat = !state.openDrawerChat;
    },
    onSliceToogleSidebar: (state) => {
      state.openDrawerSidebar = !state.openDrawerSidebar;
    },
    onSliceToogleSidebarMobile: (state) => {
      state.openDrawerSidebarMobile = !state.openDrawerSidebarMobile;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onSliceToogleDrawerChat,
  onSliceToogleSidebar,
  onSliceToogleSidebarMobile,
} = uiSlice.actions;
