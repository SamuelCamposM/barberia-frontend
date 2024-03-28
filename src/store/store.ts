import { configureStore } from "@reduxjs/toolkit";
import { chatSlice } from "./chat";
import { authSlice } from "./auth";
import { uiSlice } from "./ui";
import { menuSlice } from "../App/pages/Menu/store";
import { deptoSlice } from "../App/pages/Depto/store";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    chat: chatSlice.reducer,
    ui: uiSlice.reducer,
    menu: menuSlice.reducer,
    depto: deptoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
