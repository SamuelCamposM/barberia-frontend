import {
  Cancel,
  CancelOutlined,
  Check,
  Create,
  Delete,
  DeleteForever,
  ExpandMore,
} from "@mui/icons-material";
import { DeptoItem, useDeptoStore } from "..";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { Acciones, Confirm, confirmConfiguration } from "../../../components";
import { useForm, useProvideSocket } from "../../../../hooks";
import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import { handleSocket, required } from "../../../../helpers";
import { TextField } from "@mui/material";
import { ErrorSocket } from "../../../../interfaces/global";
import { SocketEmitEvent } from "../helpers";
import { toast } from "react-toastify";

export const Row = ({ depto }: { depto: DeptoItem }) => {
  const { socket } = useProvideSocket();
  const { setAgregando } = useDeptoStore();
  const [editando, setEditando] = useState(!Boolean(depto._id));

  const esNuevo = useMemo(() => !Boolean(depto._id), []);

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
  } = useForm(propsUseForm(depto), config);
  const handleGuardar = () => {
    socket?.emit(
      SocketEmitEvent.agregar,
      formValues,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        if (error) return;

        setAgregando(false);
      }
    );
  };
  const handleEditar = () => {
    const itemToEdit: DeptoItem = { ...depto, ...formValues };
    socket?.emit(
      SocketEmitEvent.editar,
      itemToEdit,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
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

    if (esNuevo) {
      handleGuardar();
    } else {
      handleEditar();
    }
  };

  const handleEliminar = useCallback(() => {
    socket?.emit(
      SocketEmitEvent.eliminar,
      { _id: depto._id },
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        if (error) return;
      }
    );
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
      //   rowActive._id === row._id &&
      //   "animate__animated animate__lightSpeedInRight"
      // }`}
    >
      <StyledTableCell
        padding="checkbox"
        // className={`pendingActive ${
        //   rowActive._id === row._id && "active"
        // }`}
      >
        <Acciones
          actions={[
            {
              color: editando ? "error" : "primary",
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
                toast.error(
                  <Confirm
                    titulo="Esta seguro de eliminar el departamento?"
                    actions={[
                      {
                        color: "error",
                        Icon: Check,
                        name: "Si",
                        onClick() {
                          handleEliminar();
                        },
                        size: "small",
                        tipo: "boton",
                      },
                    ]}
                  />,
                  confirmConfiguration
                );
              },
              tipo: "icono",
              size: "small",
              ocultar: esNuevo,
            },
            {
              color: "secondary",
              Icon: ExpandMore,
              name: `Ver municipios`,
              onClick: () => {
                // handleEditar(row);
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
          <StyledTableCell>{depto.name}</StyledTableCell>
          <StyledTableCell>{depto.totalMunicipios}</StyledTableCell>
        </>
      )}
    </StyledTableRow>
  );
};
