import { configureStore } from "@reduxjs/toolkit";
import { chatSlice } from "./chat";
import { authSlice } from "./auth";
import { uiSlice } from "./ui";
import { menuSlice } from "../App/pages/Menu/store";
import { usuarioSlice } from "../App/pages/Usuario/store";
import { productoSlice } from "../App/pages/Producto/store";
import { compraSlice } from "../App/pages/Compra/store";
// import { deptoSlice } from "../App/pages/Depto/store";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    chat: chatSlice.reducer,
    ui: uiSlice.reducer,
    menu: menuSlice.reducer,
    usuario: usuarioSlice.reducer,
    producto: productoSlice.reducer,
    compra: compraSlice.reducer,
    // depto: deptoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
