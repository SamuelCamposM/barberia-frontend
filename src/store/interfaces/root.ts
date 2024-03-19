import { MenuState, UiState } from ".";
import { AuthState } from "./auth";
import { ChatState } from "./chat";

export interface RootState {
  auth: AuthState;
  chat: ChatState;
  ui: UiState;
  menu: MenuState;
}
