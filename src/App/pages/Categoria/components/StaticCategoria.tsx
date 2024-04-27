import { Acciones } from "../../../components";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { Checkbox, Tooltip } from "@mui/material";
import { Create, DeleteForever } from "@mui/icons-material";
import { Dispatch, useCallback } from "react";
import { handleSocket } from "../../../../helpers";
import { CategoriaItem, SocketEmitCategoria } from "..";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useMenuStore } from "../../Menu";
import { useProvideSocket } from "../../../../hooks";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import Swal from "sweetalert2";

export const StaticCategoria = ({
  categoria,
  busqueda,
  setEditando,
  actionsJoins = [],
}: {
  categoria: CategoriaItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins?: Action[];
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const onClickEditar = () => {
    if (noTienePermiso("Categoria", "update")) return;
    setEditando((prev) => !prev);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Categoria", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Categoria`,
      text: categoria.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitCategoria.eliminar,
          { _id: categoria._id },
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
      className={categoria.crud?.agregando || categoria.crud?.editado ? "animate__animated animate__pulse" : ""}
      key={categoria._id}
      crud={categoria.crud}
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
              checked={categoria.estado}
              color="primary"
            />
          </Tooltip>
        </Acciones>
      </StyledTableCell>
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({ busqueda: busqueda, texto: categoria.name })
          : categoria.name}
      </StyledTableCell>
    </StyledTableRow>
  );
};
