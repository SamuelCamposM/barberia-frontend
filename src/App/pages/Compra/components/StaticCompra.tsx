import { useCallback, useMemo } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { usePageStore } from "../../Page";
import { CompraItem, SocketEmitCompra } from "..";
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
import { clienteAxios } from "../../../../api";
import { saveAs } from "file-saver";
export const StaticCompra = ({
  compra,
  actionsJoins = [],
  handleEditar,
  itemActive,
  busqueda,
}: {
  compra: CompraItem;
  busqueda: string;
  actionsJoins?: Action[];
  handleEditar: (itemEditing: CompraItem) => void;
  itemActive: CompraItem;
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const { socket } = useProvideSocket();
  const finalizada = useMemo(() => compra.estado === "FINALIZADA", []);
  const anulada = useMemo(() => compra.estado === "ANULADA", []);
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Depto", "delete")) return;
    Swal.fire({
      title: `¿Desea ${
        compra.estado === "ANULADA" ? "poner EN PROCESO" : "ANULAR"
      } la compra de ${compra.proveedor.nombreCompleto}?`,
      text: `Para: ${compra.sucursal.name}`,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitCompra.eliminar,
          { _id: compra._id, estado: compra.estado },
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
        handleEditar(compra);
      }}
    >
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: itemActive?._id === compra._id ? "secondary" : "primary",
              Icon: finalizada ? Visibility : Create,
              name: `Editar`,
              onClick: () => {
                handleEditar(compra);
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
            {
              ocultar: !finalizada,
              color: anulada ? "success" : "error",
              Icon: PictureAsPdf,
              name: `Reporte PDF`,
              onClick: async () => {
                try {
                  const res = await clienteAxios.get(
                    `/compra/pdf/${compra._id}`,
                    {
                      responseType: "blob",
                    }
                  );

                  const pdfBlob = new Blob([res.data], {
                    type: "application/pdf",
                  });
                  saveAs(
                    pdfBlob,
                    `COMPRA: ${compra.proveedor.nombreCompleto}.pdf`
                  );
                } catch (error: any) {
                  // const msg =
                  //   error?.response?.data?.msg ||
                  //   "Error al consultar los detalles de ventas";
                }
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
              compra.estado === "ANULADA"
                ? theme.palette.error.light
                : compra.estado === "FINALIZADA"
                ? theme.palette.success.light
                : theme.palette.primary.dark,
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
        <StyledTableCell align="center">
          {compra.totalProductos}
        </StyledTableCell>
        <StyledTableCell align="center">$ {compra.gastoTotal}</StyledTableCell>
        <StyledTableCell>{`${compra.rUsuario.lastname} ${compra.rUsuario.name}`}</StyledTableCell>
        <StyledTableCell>{formatearFecha(compra.createdAt)}</StyledTableCell>
      </>
    </StyledTableRow>
  );
};
