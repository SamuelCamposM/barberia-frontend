import { CssBaseline, ThemeProvider } from "@mui/material";
import { purpleTheme } from "./theme";
import { useAuthStore } from "../hooks";
import { useMemo } from "react";

export const AppTheme = ({ children }: { children: JSX.Element }) => {
  const { usuario } = useAuthStore();
  const tema = useMemo(() => purpleTheme(), [usuario]);
  return (
    <ThemeProvider theme={tema}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
