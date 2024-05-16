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
  PictureAsPdf,
  Restore,
  Visibility,
} from "@mui/icons-material";
import { Checkbox, Tooltip } from "@mui/material";
import { clienteAxios } from "../../../../api";
import { saveAs } from "file-saver";

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
  const deshabilitar = useMemo(() => !venta.estado, []);
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Depto", "delete")) return;
    Swal.fire({
      title: `¿
   
      ?`,
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
              Icon: deshabilitar ? Visibility : Create,
              name: `Editar`,
              onClick: () => {
                handleEditar(venta);
              },
              tipo: "icono",
              size: "small",
            },
            {
              ocultar: deshabilitar,
              color: deshabilitar ? "success" : "error",
              Icon: deshabilitar ? Restore : DeleteForever,
              name: `Eliminar`,
              onClick: () => {
                handleEliminar();
              },
              tipo: "icono",
              size: "small",
            },
            {
              ocultar: deshabilitar,
              color: "error",
              Icon: PictureAsPdf,
              name: `Reporte PDF`,
              onClick: async () => {
                const res = await clienteAxios.get(`/venta/pdf/${venta._id}`, {
                  responseType: "blob",
                });
                console.log({ res });

                const pdfBlob = new Blob([res.data], {
                  type: "application/pdf",
                });
                saveAs(pdfBlob, `VENTA: ${venta.cliente.name}.pdf`);
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
              disabled
              checked={venta.estado}
              color="primary"
            />
          </Tooltip>
        </Acciones>
      </StyledTableCell>
      <>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: venta.cliente.lastname,
              })
            : venta.cliente.lastname}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: venta.sucursal.name,
              })
            : venta.sucursal.name}
        </StyledTableCell>
        <StyledTableCell align="center">{venta.totalProductos}</StyledTableCell>
        <StyledTableCell align="center">$ {venta.gastoTotal}</StyledTableCell>
        <StyledTableCell>
          {`${venta.rUsuario.lastname} ${venta.rUsuario.name}`}
        </StyledTableCell>
        <StyledTableCell>{formatearFecha(venta.createdAt)}</StyledTableCell>
      </>
    </StyledTableRow>
  );
};
