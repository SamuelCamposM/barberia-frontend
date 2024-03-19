import { createTheme } from "@mui/material";
import { red, blueGrey, purple, blue, grey } from "@mui/material/colors";

// declare module '@mui/material/styles' {
//   interface Palette {
//     tertiary: Palette['primary'];
//   }
//   interface PaletteOptions {
//     tertiary: PaletteOptions['primary'];
//   }
// }

export const purpleTheme = () => {
  return createTheme({
    palette: {
      mode: "dark",
      primary: { main: grey["800"] },
      secondary: { main: blue["500"] },
      // tertiary: { main: blueGrey["500"], dark: "#607d8b", light: "#78909c" },

      error: {
        main: red[400],
      },
    },
    components: { MuiTextField: { defaultProps: { autoComplete: "off" } } },
    typography: {},
  });
};
