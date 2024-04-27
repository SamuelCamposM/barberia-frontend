import { useCallback } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { useMenuStore } from "../../Menu";
import { ProductoItem, SocketEmitProducto } from "..";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../hooks";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { formatearFecha, handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { Create, DeleteForever } from "@mui/icons-material";
import { Avatar, Box, Checkbox, Tooltip } from "@mui/material";

export const StaticProducto = ({
  producto,
  actionsJoins = [],
  handleEditar,
  itemActive,
  busqueda,
}: {
  producto: ProductoItem;
  busqueda: string;
  actionsJoins?: Action[];
  handleEditar: (itemEditing: ProductoItem) => void;
  itemActive: ProductoItem;
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();

  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Depto", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Depto`,
      text: producto.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitProducto.eliminar,
          { _id: producto._id },
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
      key={producto._id}
      crud={producto.crud}
      onDoubleClick={() => {
        handleEditar(producto);
      }}
    >
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: itemActive?._id === producto._id ? "secondary" : "primary",
              Icon: Create,
              name: `Editar`,
              onClick: () => {
                handleEditar(producto);
              },
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
              ocultar: true,
            },
            ...actionsJoins,
          ]}
        >
          <Tooltip title="Estado">
            <Checkbox
              sx={{ p: 0.5, m: 0 }}
              size="small"
              checked={producto.estado}
              color="primary"
            />
          </Tooltip>
        </Acciones>
      </StyledTableCell>
      <>
        <StyledTableCell>
          <Box display={"flex"} justifyContent={"center"}>
            <Avatar
              src={producto.photo}
              sx={{
                cursor: "pointer",
                transition: "all .5s",
                ":hover": { opacity: 0.5 },
              }}
              onClick={() => {
                if (!producto.photo) return;
                window.open(producto.photo);
              }}
            />
          </Box>
        </StyledTableCell>
        <StyledTableCell>
          {useResaltarTexto({
            texto: producto.name,
            busqueda,
          })}
        </StyledTableCell>
        <StyledTableCell align="center"> {producto.price} </StyledTableCell>
        <StyledTableCell align="center">
          {producto.tipoProducto}
        </StyledTableCell>
        <StyledTableCell align="center">
          {useResaltarTexto({
            texto: producto.categoria.name,
            busqueda,
          })}
        </StyledTableCell>
        <StyledTableCell align="center">
          {useResaltarTexto({
            texto: producto.marca.name,
            busqueda,
          })}
        </StyledTableCell>
        <StyledTableCell>{formatearFecha(producto.createdAt)}</StyledTableCell>
      </>
    </StyledTableRow>
  );
};
