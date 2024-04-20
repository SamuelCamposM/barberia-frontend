import { useCallback } from "react";
import {
  StyledBadge,
  StyledTableCell,
  StyledTableRow,
} from "../../../components/style";
import { useThemeSwal } from "../../../hooks";
import { useMenuStore } from "../../Menu";
import { UsuarioItem, SocketEmitUsuario } from "..";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../hooks";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { formatearFecha, handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { Create, DeleteForever } from "@mui/icons-material";
import { Avatar, Box } from "@mui/material";

export const StaticUsuario = ({
  usuario,
  actionsJoins = [],
  handleEditar,
}: {
  usuario: UsuarioItem;
  busqueda: string;
  actionsJoins?: Action[];
  handleEditar: (itemEditing: UsuarioItem) => void;
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();

  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Depto", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Depto`,
      text: usuario.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitUsuario.eliminar,
          { _id: usuario._id },
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
      key={usuario._id}
      crud={usuario.crud}
      // onDoubleClick={() => {
      //   setEditando(true);
      // }}
    >
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: "primary",
              Icon: Create,
              name: `Editar`,
              onClick: () => {
                handleEditar(usuario);
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
            },
            ...actionsJoins,
          ]}
        />
      </StyledTableCell>
      <>
        <StyledTableCell>
          <Box display={"flex"} justifyContent={"center"}>
            <StyledBadge
              active={usuario.online ? 1 : 0}
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                sx={{
                  cursor: "pointer",
                  transition: "all .5s",
                  ":hover": { opacity: 0.5 },
                }}
                onClick={() => {
                  if (!usuario.photo) return;
                  window.open(usuario.photo);
                }}
              >
                <Avatar src={usuario.photo} />
              </Box>
            </StyledBadge>
          </Box>
        </StyledTableCell>
        <StyledTableCell>{`${usuario.lastname} ${usuario.name}`}</StyledTableCell>
        <StyledTableCell>{usuario.email}</StyledTableCell>
        <StyledTableCell>{usuario.tel}</StyledTableCell>
        <StyledTableCell>{formatearFecha(usuario.createdAt)}</StyledTableCell>
      </>
    </StyledTableRow>
  );
};
