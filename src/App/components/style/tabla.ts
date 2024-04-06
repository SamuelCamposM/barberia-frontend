import {
  Box,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  styled,
} from "@mui/material";
import { Crud } from "../../../interfaces/global";
import { agregarTransparencia } from "../../../helpers";

export const StyledTableContainer = styled(TableContainer)({
  flexGrow: 1,
  animationDuration: "0.5s",
});

export const StyledTableCell = styled(TableCell)(
  ({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(0, 0.5),
    ":first-of-type": {
      borderInline: `1px solid ${agregarTransparencia(
        theme.palette.secondary.light,
        0.25
      )}`,
    },

    "&.active": {
      background: theme.palette.secondary.dark,
    },
  })
);

export const StyledTableRow = styled(TableRow)<{
  crud?: Crud;
  component?: string;
}>(({ theme, crud }) => ({
  cursor: "pointer",
  "& > *": { borderBottom: "unset" },
  backgroundColor: crud?.editado
    ? agregarTransparencia(theme.palette.secondary.light, 0.25)
    : crud?.eliminado
    ? agregarTransparencia(theme.palette.error.light, 0.25)
    : crud?.nuevo
    ? agregarTransparencia(theme.palette.success.light, 0.25)
    : "", // Utilizando el color aquí
}));
export const StyledTableHeaderCell = styled(TableCell)<{
  sorteable?: 1 | 0;
  active?: 1 | 0;
}>(({ theme, sorteable, active }) => ({
  padding: theme.spacing(0, 0.5),
  cursor: "pointer",
  fontWeight: "bold",
  textTransform: "uppercase",
  color: active
    ? theme.palette.secondary.contrastText
    : theme.palette.primary.contrastText,

  background: active
    ? sorteable
      ? theme.palette.secondary.dark
      : ""
    : agregarTransparencia(theme.palette.primary.light, 0.7),

  transition: "background 0.3s",
  ":hover": {
    color: sorteable ? theme.palette.secondary.contrastText : "",
    background: sorteable ? theme.palette.secondary.dark : "",
  },
}));

export const StyledContainerSubTable = styled(Box)(({ theme }) => ({
  padding: 1,
  background: `linear-gradient(0deg, ${agregarTransparencia(
    theme.palette.primary.dark,
    0.075
  )} 20%, ${agregarTransparencia(theme.palette.primary.dark, 0.15)} 100%)`,
}));
