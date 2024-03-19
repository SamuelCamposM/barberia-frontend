import { CssBaseline, ThemeProvider } from "@mui/material";
import { purpleTheme } from "./theme";
import { useAuthStore } from "../hooks";
import { useMemo } from "react";

export const AppTheme = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuthStore();
  const tema = useMemo(() => purpleTheme(), [user]);
  return (
    <ThemeProvider theme={tema}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
