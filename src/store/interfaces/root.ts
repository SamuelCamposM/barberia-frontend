import { UiState } from ".";
import { AuthState } from "./auth";
import { ChatState } from "./chat";
import { MenuState } from "../../App/pages/Menu";
import { DeptoState } from "../../App/pages/Depto";
import { UsuarioState } from "../../App/pages/Usuario";
import { ProductoState } from "../../App/pages/Producto";
import { CompraState } from "../../App/pages/Compra";
import { VentaState } from "../../App/pages/Venta";
import { CitaState } from "../../App/pages/Cita";
export interface RootState {
  auth: AuthState;
  chat: ChatState;
  ui: UiState;
  menu: MenuState;
  depto: DeptoState;
  usuario: UsuarioState;
  producto: ProductoState;
  compra: CompraState;
  venta: VentaState;
  cita: CitaState;
}
