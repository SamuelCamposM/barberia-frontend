import { AppBar, Theme, styled } from "@mui/material";
import { Box } from "@mui/material";

export const LayoutBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  height: `100vh`,
  overflow: "hidden",
  ".row": {
    flexDirection: "row",
  },
});
export const LayoutBox2 = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  overflow: "auto",
});
export const ContentBox = styled(Box)({
  flexGrow: 1,
  overflow: "auto",
});

export const AppBarHeader = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  background: theme.palette.primary.main,
  // background: `linear-gradient(45deg, ${theme.palette.success.dark} 30%, ${theme.palette.secondary.main} 90%)`,
  zIndex: theme.zIndex.drawer + 1,
  paddingLeft: 24,
  ".toolbar": {
    height: theme.mixins.toolbar.minHeight,
    display: "flex",
    justifyContent: "space-between",
  },
  ".boxEmpresa": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ".logoEmpresa": {
      mr: 1, 
    },
    ".textoEmpresa": {
      mr: 2,
      fontFamily: "monospace",
      fontWeight: 700,
      letterSpacing: ".3rem", 
      textDecoration: "none",
    },
  },
}));
export const AppBarFooter = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  background: "transparent", //  theme.palette.primary.main,

  zIndex: theme.zIndex.drawer + 1,
  [theme.breakpoints.down("md")]: {
    zIndex: theme.zIndex.drawer,
  },
  ".toolbar": {
    height: theme.mixins.toolbar.minHeight,
  },
  ".boxChat": {
    flexGrow: 1,
    ".botonChat": { 
      display: "block",
    },
  },
  ".boxOnline": { flexGrow: 0, display: "flex", alignItems: "center" },

  ".Typography": {
    marginRight: theme.spacing(1),
  },
}));
