import { useTheme } from "@mui/material";
export const useThemeSwal = () => {
  // Llama a useTheme directamente en el nivel superior
  const theme = useTheme();

  return {
    background: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
    color: theme.palette.mode === "dark" ? "#fff" : "#1e1e1e",
    confirmButtonColor: theme.palette.primary.main, // Color del botón de confirmación
    cancelButtonColor: theme.palette.secondary.main, // Color del botón de cancelación
    denyButtonColor: theme.palette.error.main,
  };
};
