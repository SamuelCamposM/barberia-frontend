import { Dispatch, useCallback } from "react";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../../../components/style";
import { useThemeSwal } from "../../../../../hooks";
import { usePageStore } from "../../../../Page";
import { DetCompraItem } from "../interfaces";
import Swal from "sweetalert2";
import { Acciones } from "../../../../../components";
import { Create, DeleteForever } from "@mui/icons-material";
import { CompraItem } from "../../../interfaces";
export const StaticDetCompra = ({
  detCompra,
  setEditando,
  setformValues: setCompraValues,
  finalizada,
}: {
  detCompra: DetCompraItem;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  setformValues: Dispatch<React.SetStateAction<CompraItem>>;
  finalizada: boolean;
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const onClickEditar = () => {
    if (noTienePermiso("Compra", "update")) return;
    setEditando((prev) => !prev);
  };

  const handleEditar = () => {
    setCompraValues((prev) => {
      if (detCompra.crud?.nuevo) {
        return {
          ...prev,
          detComprasData: prev.detComprasData.filter(
            (item) => item._id !== detCompra._id
          ),
        };
      }

      return {
        ...prev,
        detComprasData: prev.detComprasData.map((item) =>
          item._id === detCompra._id
            ? {
                ...detCompra,
                crud: {
                  eliminado: !item.crud?.eliminado,
                },
              }
            : item
        ),
      };
    });
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
        handleEditar();
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
              ocultar: detCompra.crud?.eliminado,
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
      <StyledTableCell>{detCompra.producto.name}</StyledTableCell>
      <StyledTableCell> {detCompra.cantidad}</StyledTableCell>
      <StyledTableCell>$ {detCompra.precioUnidad}</StyledTableCell>
      <StyledTableCell>$ {detCompra.total}</StyledTableCell>
    </StyledTableRow>
  );
};
