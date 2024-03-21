import { createTheme } from "@mui/material";
import { red, blue, grey, deepOrange } from "@mui/material/colors";

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
      secondary: { main: grey["500"] },
      tertiary: { main: red["500"] },

      error: {
        main: deepOrange[800],
      },
    },
    components: { MuiTextField: { defaultProps: { autoComplete: "off" } } },
    typography: {},
  });
};
