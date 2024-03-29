import {
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
});

export const StyledTableCell = styled(TableCell)(
  ({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(0, 0.5),
    ":first-of-type": {
      borderInline: `1px solid ${agregarTransparencia(
        theme.palette.secondary.light,
        0.25
      )}`,
      borderRadius: "50px 0px 0px 50px",
    },
    ":last-child": {
      borderRadius: "0px 50px 50px 0px",
    },
    "&.active": {
      background: theme.palette.secondary.dark,
    },
  })
);

export const StyledTableRow = styled(TableRow)<{ crud?: Crud; component?: string }>(
  ({ theme, crud }) => ({
    cursor: "pointer",
    backgroundColor: crud?.editado
      ? agregarTransparencia(theme.palette.secondary.light, 0.25)
      : crud?.eliminado
      ? agregarTransparencia(theme.palette.error.light, 0.25)
      : crud?.nuevo
      ? agregarTransparencia(theme.palette.success.light, 0.25)
      : "", // Utilizando el color aquí
  })
);

export const StyledTableHeaderCell = styled(TableCell)(
  ({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(0, 0.5),
    color: theme.palette.primary.contrastText,
    background: `linear-gradient(0deg, ${agregarTransparencia(
      theme.palette.primary.dark,
      0.75
    )}, ${agregarTransparencia(theme.palette.primary.light, 1)})`,
    cursor: "pointer",
    fontWeight: "bold",
    textTransform: "uppercase",
  })
);
