import { Dispatch, useCallback } from "react";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../../../hooks";
import { useMenuStore } from "../../../../Menu";
import { MunicipioItem } from "../interfaces";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../../../hooks";
import { SocketEmitMunicipio } from "../helpers";
import { ErrorSocket } from "../../../../../../interfaces/global";
import { handleSocket } from "../../../../../../helpers";
import { Acciones } from "../../../../../components";
import { Create, DeleteForever } from "@mui/icons-material";

export const StaticMunicipio = ({
  municipio,
  busqueda,
  setEditando,
  compra,
}: {
  municipio: MunicipioItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  compra: string;
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const onClickEditar = () => {
    if (noTienePermiso("Compra", "update")) return;
    setEditando((prev) => !prev);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Compra", "delete")) return;
    Swal.fire({
      title: `¿Desea eliminar el producto de la compra?`,
      text: municipio.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitMunicipio.eliminar,
          { _id: municipio._id, compra },
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
      key={municipio._id}
      crud={municipio.crud}
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
          ]}
        />
      </StyledTableCell>
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({ busqueda: busqueda, texto: municipio.name })
          : municipio.name}
      </StyledTableCell>
    </StyledTableRow>
  );
};
