import { configureStore } from "@reduxjs/toolkit";
import { chatSlice } from "./chat";
import { authSlice } from "./auth";
import { uiSlice } from "./ui";
import { menuSlice } from "./menu";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    chat: chatSlice.reducer,
    ui: uiSlice.reducer,
    menu: menuSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
