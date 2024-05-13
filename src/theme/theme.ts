import { createTheme } from "@mui/material";
import { red, deepOrange, green, blueGrey, purple, blue } from "@mui/material/colors";

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
      primary: { main: blue["500"] },
      secondary: { main: blueGrey["300"] },
      tertiary: { main: deepOrange["100"] },
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
