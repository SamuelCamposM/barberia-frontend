import { Dispatch, useCallback } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { useMenuStore } from "../../Menu";
import { CompraItem, SocketEmitCompra } from "..";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../hooks";

import { Action, ErrorSocket } from "../../../../interfaces/global";
import {
  agregarTransparencia,
  formatearFecha,
  handleSocket,
} from "../../../../helpers";
import { Acciones } from "../../../components";
import { Create, DeleteForever } from "@mui/icons-material";

export const StaticCompra = ({
  compra,
  busqueda,
  setEditando,
  actionsJoins = [],
  finalizada,
}: {
  compra: CompraItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins: Action[];
  finalizada: boolean;
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const onClickEditar = () => {
    if (noTienePermiso("Compra", "update")) return;
    setEditando((prev) => !prev);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Compra", "delete")) return;
    Swal.fire({
      title: `Desea eliminar la compra de`,
      text: compra.proveedor.nombreCompleto,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitCompra.eliminar,
          { _id: compra._id },
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
      key={compra._id}
      crud={compra.crud}
      onDoubleClick={() => {
        if (!finalizada) setEditando(true);
      }}
    >
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: "primary",
              disabled: finalizada,
              Icon: Create,
              name: `Editar`,
              onClick: onClickEditar,
              tipo: "icono",
              size: "small",
            },

            {
              color: "error",
              disabled: finalizada,
              Icon: DeleteForever,
              name: `Eliminar`,
              onClick: () => {
                handleEliminar();
              },
              tipo: "icono",
              size: "small",
            },
            ...actionsJoins,
          ]}
        />
      </StyledTableCell>

      <StyledTableCell
        sx={{
          background: (theme) =>
            agregarTransparencia(
              compra.estado === "ANULADA"
                ? theme.palette.error.light
                : compra.estado === "FINALIZADA"
                ? theme.palette.success.light
                : theme.palette.primary.dark,
              0.5
            ),
        }}
      >
        {compra.estado}
      </StyledTableCell>
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({
              busqueda: busqueda,
              texto: compra.proveedor.nombreCompleto,
            })
          : compra.proveedor.nombreCompleto}
      </StyledTableCell>
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({
              busqueda: busqueda,
              texto: compra.sucursal.name,
            })
          : compra.sucursal.name}
      </StyledTableCell>
      <StyledTableCell>{compra.totalProductos}</StyledTableCell>
      <StyledTableCell>$ {compra.gastoTotal}</StyledTableCell>
      <StyledTableCell>{compra.rUsuario.name}</StyledTableCell>
      <StyledTableCell>{formatearFecha(compra.createdAt)}</StyledTableCell>
    </StyledTableRow>
  );
};
