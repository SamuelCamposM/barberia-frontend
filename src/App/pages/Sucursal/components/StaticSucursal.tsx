import { Dispatch, useCallback } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { useMenuStore } from "../../Menu";
import { SucursalItem, SocketEmitSucursal } from "..";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../hooks";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { Create, DeleteForever } from "@mui/icons-material";
export const StaticSucursal = ({
  sucursal,
  busqueda,
  setEditando,
  actionsJoins = [],
}: {
  sucursal: SucursalItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins?: Action[];
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const onClickEditar = () => {
    if (noTienePermiso("Depto", "update")) return;
    setEditando((prev) => !prev);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Depto", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Depto`,
      text: sucursal.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitSucursal.eliminar,
          { _id: sucursal._id },
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
      key={sucursal._id}
      crud={sucursal.crud}
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
      <>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: sucursal.depto.name,
              })
            : sucursal.depto.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: sucursal.municipio.name,
              })
            : sucursal.municipio.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({ busqueda: busqueda, texto: sucursal.name })
            : sucursal.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({ busqueda: busqueda, texto: sucursal.tel })
            : sucursal.tel}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: sucursal.direccion,
              })
            : sucursal.direccion}
        </StyledTableCell>
      </>
    </StyledTableRow>
  );
};
