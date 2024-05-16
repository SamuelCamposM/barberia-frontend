import { useCallback, useState } from "react";
import {
  StyledContainerSubTable,
  StyledTableCell,
  StyledTableRow,
} from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { useMenuStore } from "../../Menu";
import { ProductoItem, SocketEmitProducto, columns } from "..";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../hooks";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { formatearFecha, handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import {
  Create,
  DeleteForever,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Checkbox,
  Collapse,
  TableRow,
  Tooltip,
} from "@mui/material"; 
import { StocksProducto } from "./StocksProducto";

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
  const [expandir, setexpandir] = useState(false);
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
    <>
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
                color:
                  itemActive?._id === producto._id ? "secondary" : "primary",
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
              {
                badge: String(producto.stocks.length),
                color: "secondary",
                Icon: expandir ? ExpandLess : ExpandMore,
                name: `Ver stocks`,
                onClick: async () => {
                  // const res = await clienteAxios.post(
                  //   "/producto/getProductoStock",
                  //   {
                  //     _id: producto._id,
                  //   }
                  // );
                  // console.log({ res });

                  setexpandir(!expandir);
                },
                tipo: "icono",
                size: "small",
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
              {producto.photos.map((photo) => (
                <Avatar
                  key={photo}
                  src={photo}
                  sx={{
                    cursor: "pointer",
                    transition: "all .5s",
                    ":hover": { opacity: 0.5 },
                  }}
                  onClick={() => {
                    if (!photo) return;
                    window.open(photo);
                  }}
                />
              ))}
            </Box>
          </StyledTableCell>
          <StyledTableCell>
            {useResaltarTexto({
              texto: producto.name,
              busqueda,
            })}
          </StyledTableCell>
          <StyledTableCell align="center"> ${producto.price} </StyledTableCell>
          <StyledTableCell align="center">
            {producto.stockTotal}
          </StyledTableCell>
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
          <StyledTableCell>{`${producto.rUsuario.lastname} ${producto.rUsuario.name}`}</StyledTableCell>
          <StyledTableCell>
            {formatearFecha(producto.createdAt)}
          </StyledTableCell>
        </>
      </StyledTableRow>
      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell colSpan={columns.length / 2}>
          <Collapse in={expandir} timeout="auto">
            <StyledContainerSubTable>
              <StocksProducto _id={producto._id || ""} />
            </StyledContainerSubTable>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};
