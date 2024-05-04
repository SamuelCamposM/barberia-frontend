import { Dispatch, useCallback } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { useMenuStore } from "../../Menu";
import { CompraItem, SocketEmitCompra } from "..";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../hooks";

import { Action, ErrorSocket } from "../../../../interfaces/global";
import { handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { Create, DeleteForever } from "@mui/icons-material";

export const StaticCompra = ({
  compra,
  busqueda,
  setEditando,
  actionsJoins = [],
}: {
  compra: CompraItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins: Action[];
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
        setEditando(true);
      }}
    >
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: "primary",
              disabled: false,
              Icon: Create,
              name: `Editar`,
              onClick: onClickEditar,
              tipo: "icono",
              size: "small",
            },

            {
              color: "error",
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

      <StyledTableCell>{compra.estado}</StyledTableCell>
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
      <StyledTableCell>compra.rUsuario.name</StyledTableCell>
    </StyledTableRow>
  );
};
