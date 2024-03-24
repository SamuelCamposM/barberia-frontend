import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { Provider } from "react-redux";
import { store } from "./store";
import { AppTheme } from "./theme";
import { SocketProvider } from "./context/SocketContext";
import { Box } from "@mui/material";

export const ChatApp = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <AppTheme>
          <BrowserRouter>
            <Box height={"100vh"}>
              <AppRouter />
            </Box>
          </BrowserRouter>
        </AppTheme>
      </SocketProvider>
    </Provider>
  );
};
