import { Acciones } from "../../../components";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { Checkbox, Tooltip } from "@mui/material";
import { Create, DeleteForever } from "@mui/icons-material";
import { Dispatch, useCallback } from "react";
import { handleSocket } from "../../../../helpers";
import { ProveedorItem, SocketEmitProveedor } from "..";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { usePageStore } from "../../Page";
import { useProvideSocket } from "../../../../hooks";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import Swal from "sweetalert2";

export const StaticProveedor = ({
  proveedor,
  busqueda,
  setEditando,
  actionsJoins = [],
}: {
  proveedor: ProveedorItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins?: Action[];
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const { socket } = useProvideSocket();
  const onClickEditar = () => {
    if (noTienePermiso("Proveedor", "update")) return;
    setEditando((prev) => !prev);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Proveedor", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Proveedor`,
      text: proveedor.nombreCompleto,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitProveedor.eliminar,
          { _id: proveedor._id },
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
      className={proveedor.crud?.agregando || proveedor.crud?.editado ? "animate__animated animate__pulse" : ""}
      key={proveedor._id}
      crud={proveedor.crud}
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
        >
          <Tooltip title="Estado">
            <Checkbox
              sx={{ p: 0.5, m: 0 }}
              size="small"
              disabled
              checked={proveedor.estado}
              color="primary"
            />
          </Tooltip>
        </Acciones>
      </StyledTableCell>
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({ busqueda: busqueda, texto: proveedor.nombreCompleto })
          : proveedor.nombreCompleto}
      </StyledTableCell>
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({ busqueda: busqueda, texto: proveedor.email })
          : proveedor.email}
      </StyledTableCell>
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({ busqueda: busqueda, texto: proveedor.telefono })
          : proveedor.telefono}
      </StyledTableCell>
    </StyledTableRow>
  );
};
