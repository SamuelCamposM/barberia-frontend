import { useCallback, useMemo } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { useMenuStore } from "../../Menu";
import { VentaItem, SocketEmitVenta } from "..";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../hooks";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { formatearFecha, handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import {
  Create,
  DeleteForever,
  Restore,
  Visibility,
} from "@mui/icons-material";

export const StaticVenta = ({
  venta,
  actionsJoins = [],
  handleEditar,
  itemActive,
  busqueda,
}: {
  venta: VentaItem;
  busqueda: string;
  actionsJoins?: Action[];
  handleEditar: (itemEditing: VentaItem) => void;
  itemActive: VentaItem;
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const finalizada = useMemo(() => venta.estado === "FINALIZADA", []);
  const anulada = useMemo(() => venta.estado === "ANULADA", []);
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Depto", "delete")) return;
    Swal.fire({
      title: `¿Desea ${
        venta.estado === "ANULADA" ? "poner EN PROCESO" : "ANULAR"
      } la venta de ${venta.proveedor.nombreCompleto}?`,
      text: `Para: ${venta.sucursal.name}`,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitVenta.eliminar,
          { _id: venta._id, estado: venta.estado },
          ({ error, msg }: ErrorSocket) => {
            handleSocket({ error, msg });
            if (error) return;
          }
        );
      }
    });
  }, []);
  return (
    <StyledTableRow
      key={venta._id}
      crud={venta.crud}
      onDoubleClick={() => {
        handleEditar(venta);
      }}
    >
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: itemActive?._id === venta._id ? "secondary" : "primary",
              Icon: finalizada ? Visibility : Create,
              name: `Editar`,
              onClick: () => {
                handleEditar(venta);
              },
              tipo: "icono",
              size: "small",
            },
            {
              ocultar: finalizada,
              color: anulada ? "success" : "error",
              Icon: anulada ? Restore : DeleteForever,
              name: `Eliminar`,
              onClick: () => {
                handleEliminar();
              },
              tipo: "icono",
              size: "small",
            },
            ...actionsJoins,
          ]}
        ></Acciones>
      </StyledTableCell>
      <>
        <StyledTableCell
          sx={{
            color: (theme) =>
              venta.estado === "ANULADA"
                ? theme.palette.error.light
                : venta.estado === "FINALIZADA"
                ? theme.palette.success.light
                : theme.palette.primary.dark,
          }}
        >
          {venta.estado}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: venta.proveedor.nombreCompleto,
              })
            : venta.proveedor.nombreCompleto}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: venta.sucursal.name,
              })
            : venta.sucursal.name}
        </StyledTableCell>
        <StyledTableCell align="center">
          {venta.totalProductos}
        </StyledTableCell>
        <StyledTableCell align="center">$ {venta.gastoTotal}</StyledTableCell>
        <StyledTableCell>{venta.rUsuario.name}</StyledTableCell>
        <StyledTableCell>{formatearFecha(venta.createdAt)}</StyledTableCell>
      </>
    </StyledTableRow>
  );
};
