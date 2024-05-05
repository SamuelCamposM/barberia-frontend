import { Dispatch, useCallback } from "react";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../../../hooks";
import { useMenuStore } from "../../../../Menu";
import { DetCompraItem } from "../interfaces";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../../../hooks";
import { SocketEmitDetCompra } from "../helpers";
import { ErrorSocket } from "../../../../../../interfaces/global";
import { handleSocket } from "../../../../../../helpers";
import { Acciones } from "../../../../../components";
import { Create, DeleteForever } from "@mui/icons-material";

export const StaticDetCompra = ({
  detCompra,
  busqueda,
  setEditando,
  compra,
  finalizada,
}: {
  detCompra: DetCompraItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  compra: string;
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
      title: `¿Desea eliminar el producto de la compra?`,
      text: detCompra.producto.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitDetCompra.eliminar,
          { _id: detCompra._id, compra },
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
      key={detCompra._id}
      crud={detCompra.crud}
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
          ]}
        />
      </StyledTableCell>
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({
              busqueda: busqueda,
              texto: detCompra.producto.name,
            })
          : detCompra.producto.name}
      </StyledTableCell>
      <StyledTableCell> {detCompra.cantidad}</StyledTableCell>
      <StyledTableCell>$ {detCompra.precioUnidad}</StyledTableCell>
      <StyledTableCell>$ {detCompra.total}</StyledTableCell>
    </StyledTableRow>
  );
};
