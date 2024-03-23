import { Box, TableCell, TableRow, Theme, styled } from "@mui/material";
import { Crud } from "../../../interfaces/global";
import { agregarTransparencia } from "../../../helpers";

export const StyledTableContainer = styled(Box)({
  flexGrow: 1,
});

export const StyledTableCell = styled(TableCell)(
  ({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(0, 0.5),
  })
);

export const StyledTableRow = styled(TableRow)<{ crud?: Crud }>(
  ({ theme, crud }) => ({
    cursor: "pointer",
    backgroundColor: crud?.editado
      ? agregarTransparencia(theme.palette.secondary.main, 0.5)
      : crud?.eliminado
      ? agregarTransparencia(theme.palette.error.main, 0.5)
      : crud?.nuevo
      ? agregarTransparencia(theme.palette.success.main, 0.5)
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
  })
);
