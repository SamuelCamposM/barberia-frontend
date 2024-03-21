import { UiState } from ".";
import { AuthState } from "./auth";
import { ChatState } from "./chat";
import { MenuState } from "../../App/pages/Menu";
export interface RootState {
  auth: AuthState;
  chat: ChatState;
  ui: UiState;
  menu: MenuState;
}
