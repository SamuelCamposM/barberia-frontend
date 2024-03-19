import { Box, Theme, Typography, styled } from "@mui/material";
import { agregarTransparencia } from "../../../../helpers";

export const TypographyChatActive = styled(Typography)(
  ({ theme }: { theme: Theme }) => ({
    fontSize: "2.5rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "1.5rem",
    },
  })
);
export const BoxChat = styled(Box)(({ theme }: { theme: Theme }) => ({
  flexGrow: 1,
  overflow: "auto",

  ".ListItem": {
    justifyContent: "flex-end",
  },
  ".BoxMessage": {
    maxWidth: "60%",
    borderRadius: theme.spacing(2),
    margin: `${theme.spacing(1)} ${theme.spacing(0)}`,
  },
  ".bg_BoxMessage": {
    backgroundColor: agregarTransparencia(theme.palette.primary.light, 0.2),
  },
  ".bg_BoxMessage2": {
    backgroundColor: agregarTransparencia(theme.palette.secondary.light, 0.2),
  },

  ".Avatar": {
    margin: `0 ${theme.spacing(1)}`,
  },
  ".ListItemText": {
    padding: `0 ${theme.spacing(1)}`,
  },
}));
