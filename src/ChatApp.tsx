import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { Provider } from "react-redux";
import { store } from "./store";
import { AppTheme } from "./theme";
import { SocketProvider } from "./context/SocketContext";

export const ChatApp = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <AppTheme>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AppTheme>
      </SocketProvider>
    </Provider>
  );
};
