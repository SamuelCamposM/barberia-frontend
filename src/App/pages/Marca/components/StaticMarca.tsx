import { Acciones } from "../../../components";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { Checkbox, Tooltip } from "@mui/material";
import { Create, DeleteForever } from "@mui/icons-material";
import { Dispatch, useCallback } from "react";
import { handleSocket } from "../../../../helpers";
import { MarcaItem, SocketEmitMarca } from "..";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { usePageStore } from "../../Page";
import { useProvideSocket } from "../../../../hooks";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import Swal from "sweetalert2";

export const StaticMarca = ({
  marca,
  busqueda,
  setEditando,
  actionsJoins = [],
}: {
  marca: MarcaItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins?: Action[];
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const { socket } = useProvideSocket();
  const onClickEditar = () => {
    if (noTienePermiso("Marca", "update")) return;
    setEditando((prev) => !prev);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Marca", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Marca`,
      text: marca.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitMarca.eliminar,
          { _id: marca._id },
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
      className={marca.crud?.agregando || marca.crud?.editado ? "animate__animated animate__pulse" : ""}
      key={marca._id}
      crud={marca.crud}
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
              checked={marca.estado}
              color="primary"
            />
          </Tooltip>
        </Acciones>
      </StyledTableCell>
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({ busqueda: busqueda, texto: marca.name })
          : marca.name}
      </StyledTableCell>
    </StyledTableRow>
  );
};
