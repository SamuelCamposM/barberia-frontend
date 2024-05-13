import { Dispatch, useCallback } from "react";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../../../components/style";
import { useThemeSwal } from "../../../../../hooks";
import { useMenuStore } from "../../../../Menu";
import { DetVentaItem } from "../interfaces";
import Swal from "sweetalert2";
import { Acciones } from "../../../../../components";
import { Create, DeleteForever } from "@mui/icons-material";
import { VentaItem } from "../../../interfaces";
export const StaticDetVenta = ({
  detVenta,
  setEditando,
  setformValues: setVentaValues,
  deshabilitar,
}: {
  detVenta: DetVentaItem;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  setformValues: Dispatch<React.SetStateAction<VentaItem>>;
  deshabilitar: boolean;
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = useMenuStore();
  const onClickEditar = () => {
    if (noTienePermiso("Venta", "update")) return;
    setEditando((prev) => !prev);
  };

  const handleEditar = () => {
    setVentaValues((prev) => {
      if (detVenta.crud?.nuevo) {
        return {
          ...prev,
          detVentasData: prev.detVentasData.filter(
            (item) => item._id !== detVenta._id
          ),
        };
      }

      return {
        ...prev,
        detVentasData: prev.detVentasData.map((item) =>
          item._id === detVenta._id
            ? {
                ...detVenta,
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
    if (noTienePermiso("Venta", "delete")) return;
    Swal.fire({
      title: `¿Desea eliminar el producto de la venta?`,
      text: detVenta.producto.name,
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
      key={detVenta._id}
      crud={detVenta.crud}
      onDoubleClick={() => {
        if (!deshabilitar) setEditando(true);
      }}
    >
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: "primary",
              disabled: deshabilitar,
              Icon: Create,
              name: `Editar`,
              onClick: onClickEditar,
              tipo: "icono",
              size: "small",
              ocultar: detVenta.crud?.eliminado,
            },

            {
              color: "error",
              disabled: deshabilitar,
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
      <StyledTableCell>{detVenta.producto.name}</StyledTableCell>
      <StyledTableCell> {detVenta.cantidad}</StyledTableCell>
      <StyledTableCell>  {detVenta.stock}</StyledTableCell>
      <StyledTableCell>$ {detVenta.precioUnidad}</StyledTableCell>
      <StyledTableCell>$ {detVenta.total}</StyledTableCell>
    </StyledTableRow>
  );
};
