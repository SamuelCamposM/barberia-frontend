import { createTheme } from "@mui/material";
import { red, deepOrange, green, blue, blueGrey } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary: PaletteOptions["primary"];
  }
}

export const purpleTheme = () => {
  return createTheme({
    palette: {
      mode: "dark",
      primary: { main: blue["400"] },
      secondary: { main: blueGrey["400"] },
      tertiary: { main: deepOrange["400"] },
      success: {
        main: green["600"],
      },
      error: {
        main: red["A400"],
      },
    },
    components: {
      MuiTextField: {
        defaultProps: {
          autoComplete: "off",
          variant: "standard",
        },
      },
      MuiTablePagination: {
        defaultProps: { labelRowsPerPage: "Registros" },
      },
    },
    typography: {},
  });
};
