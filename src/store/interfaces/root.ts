import { UiState } from ".";
import { AuthState } from "./auth";
import { ChatState } from "./chat";
import { MenuState } from "../../App/pages/Menu";
import { DeptoState } from "../../App/pages/Depto";
export interface RootState {
  auth: AuthState;
  chat: ChatState;
  ui: UiState;
  menu: MenuState;
  depto: DeptoState;
}
