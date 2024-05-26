import { useCallback } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { usePageStore } from "../../Page";
import { CitaItem, SocketEmitCita } from "..";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../hooks";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { formatearFecha, handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { Create, DeleteForever } from "@mui/icons-material";
export const StaticCita = ({
  cita,
  actionsJoins = [],
  handleEditar,
  itemActive,
  busqueda,
}: {
  cita: CitaItem;
  busqueda: string;
  actionsJoins?: Action[];
  handleEditar: (itemEditing: CitaItem) => void;
  itemActive: CitaItem;
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const { socket } = useProvideSocket();
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Depto", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Depto`,
      text: cita.titulo,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitCita.eliminar,
          { _id: cita._id },
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
        key={cita._id}
        crud={cita.crud}
        onDoubleClick={() => {
          handleEditar(cita);
        }}
      >
        <StyledTableCell padding="checkbox">
          <Acciones
            actions={[
              {
                color: itemActive?._id === cita._id ? "secondary" : "primary",
                Icon: Create,
                name: `Editar`,
                onClick: () => {
                  handleEditar(cita);
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
          ></Acciones>
        </StyledTableCell>
        <>
          <StyledTableCell
            sx={{
              color: (theme) =>
                cita.estadoCita === "ANULADA"
                  ? theme.palette.error.main
                  : cita.estadoCita === "FINALIZADA"
                  ? theme.palette.success.main
                  : cita.estadoCita === "AUSENCIA"
                  ? theme.palette.warning.main
                  : theme.palette.primary.main,
            }}
          >
            {cita.estadoCita}
          </StyledTableCell>

          <StyledTableCell>
            {useResaltarTexto({
              busqueda,
              texto: `${cita.empleado.lastname} ${cita.empleado.name}`,
            })}
          </StyledTableCell>

          <StyledTableCell>{formatearFecha(cita.fecha)}</StyledTableCell> 

          <StyledTableCell>{cita.titulo}</StyledTableCell>

          <StyledTableCell>{cita.description}</StyledTableCell>

          <StyledTableCell>
            {useResaltarTexto({
              busqueda,
              texto: `${cita.rUsuario.lastname} ${cita.rUsuario.name}`,
            })}
          </StyledTableCell>

          <StyledTableCell>{cita.sucursal.name}</StyledTableCell>
          <StyledTableCell>{formatearFecha(cita.createdAt)}</StyledTableCell>
        </>
      </StyledTableRow>
    </>
  );
};
