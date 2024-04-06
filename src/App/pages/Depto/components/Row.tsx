import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import { Acciones } from "../../../components";
import { DeptoItem, useDeptoStore } from "..";
import { ErrorSocket } from "../../../../interfaces/global";
import { handleSocket, required } from "../../../../helpers";
import { SocketEmitDepto } from "../helpers";
import {
  StyledContainerSubTable,
  StyledTableCell,
  StyledTableRow,
} from "../../../components/style";
import { Collapse, TableRow, TextField } from "@mui/material";
import { useForm, useProvideSocket } from "../../../../hooks";
import Swal from "sweetalert2";
import {
  CancelOutlined,
  Check,
  Create,
  DeleteForever,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useThemeSwal } from "../../../hooks";
import { TablaMunicipio } from "./Municipio/TablaMunicipio";
import { useResaltarTexto } from "../../../hooks/useResaltarTexto";
export const Row = ({ depto, q = "" }: { depto: DeptoItem; q?: string }) => {
  const { setAgregando } = useDeptoStore();

  const { socket } = useProvideSocket();
  const themeSwal = useThemeSwal();
  const [editando, setEditando] = useState(!Boolean(depto._id));
  const esNuevo = useMemo(() => !Boolean(depto._id), []);
  const [open, setopen] = useState(false);
  const config = useMemo(
    () => ({
      name: [required],
    }),
    []
  );
  const propsUseForm = useCallback(
    (item: DeptoItem) => ({
      name: item.name,
    }),
    []
  );

  const {
    formValues,
    handleChange,
    errorValues,
    handleBlur,
    onNewForm,
    isFormInvalidSubmit,
    setisSubmited,
    cargandoSubmit,
    setCargandoSubmit,
  } = useForm(propsUseForm(depto), config);
  const handleGuardar = () => {
    socket?.emit(
      SocketEmitDepto.agregar,
      formValues,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;

        setAgregando(false);
      }
    );
  };
  const handleEditar = () => {
    const itemToEdit: DeptoItem = { ...depto, ...formValues };
    socket?.emit(
      SocketEmitDepto.editar,
      itemToEdit,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;

        setEditando(false);
      }
    );
  };
  const onSubmit = () => {
    setisSubmited(true);
    if (isFormInvalidSubmit(formValues)) {
      return;
    }
    setCargandoSubmit(true);
    if (esNuevo) {
      handleGuardar();
    } else {
      handleEditar();
    }
  };

  const handleEliminar = useCallback(() => {
    Swal.fire({
      title: `Desea eliminar el Depto`,
      text: depto.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitDepto.eliminar,
          { _id: depto._id },
          ({ error, msg }: ErrorSocket) => {
            handleSocket({ error, msg });
            if (error) return;
          }
        );
      }
    });
  }, []);
  const defaultProps = {
    fullWidth: true,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onSubmit();
      }
    },
    autoComplete: "false",
  };

  return (
    <>
      <StyledTableRow
        key={depto._id}
        crud={depto.crud}
        onDoubleClick={() => {
          // handleEditar(row);
          // setActiveRow(row);
        }}
        // onMouseEnter={() => setshowButtoms(true)}
        // onMouseLeave={() => setshowButtoms(false)}
        // className={`${
        //rowActive._id === row._id &&
        //"animate__animated animate__lightSpeedInRight"
        // }`}
      >
        <StyledTableCell
          padding="checkbox"
          // className={`pendingActive ${
          //rowActive._id === row._id && "active"
          // }`}
        >
          <Acciones
            actions={[
              {
                color: editando ? "error" : "primary",
                disabled: cargandoSubmit,
                Icon: editando ? CancelOutlined : Create,
                name: `Editar`,
                onClick: () => {
                  setEditando((prev) => !prev);
                  onNewForm(propsUseForm(depto));
                },
                tipo: "icono",
                size: "small",
                ocultar: esNuevo,
              },
              {
                color: "success",
                disabled: cargandoSubmit,
                Icon: Check,
                name: `Guardar cambios`,
                onClick: () => {
                  onSubmit();
                },
                tipo: "icono",
                size: "small",
                ocultar: !editando,
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
                ocultar: esNuevo || editando,
              },
              {
                color: "secondary",
                Icon: open ? ExpandLess : ExpandMore,
                name: `Ver municipios`,
                onClick: () => {
                  setopen(!open);
                },
                tipo: "icono",
                size: "small",
                ocultar: esNuevo,
              },
            ]}
          />
        </StyledTableCell>
        {editando ? (
          <>
            <StyledTableCell>
              <TextField
                {...defaultProps}
                autoFocus
                value={formValues.name}
                onChange={handleChange}
                name="name"
                error={errorValues.name.length > 0}
                onBlur={handleBlur}
                helperText={errorValues.name.join(" - ")}
              />
            </StyledTableCell>
            <StyledTableCell>{depto.totalMunicipios}</StyledTableCell>
          </>
        ) : (
          <>
            <StyledTableCell>
              {useResaltarTexto({ busqueda: q, texto: depto.name })}
            </StyledTableCell>
            <StyledTableCell>{depto.totalMunicipios}</StyledTableCell>
          </>
        )}
      </StyledTableRow>
      <TableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <StyledContainerSubTable>
              {/* <Cargando/> */}
              <TablaMunicipio depto={depto._id || ""} />
            </StyledContainerSubTable>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};
