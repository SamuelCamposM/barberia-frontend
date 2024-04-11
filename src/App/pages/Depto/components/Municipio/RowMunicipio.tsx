import { Acciones } from "../../../../components";
import { StyledTableCell, StyledTableRow } from "../../../../components/style";
import { Municipio } from "./interfaces";
import { SocketEmitMunicipio } from "./helpers";
import { useForm, useProvideSocket } from "../../../../../hooks";
import { useResaltarTexto, useThemeSwal } from "../../../../hooks";
import { Dispatch, KeyboardEvent, useCallback, useMemo, useState } from "react";
import { handleSocket, required } from "../../../../../helpers";
import { ErrorSocket } from "../../../../../interfaces/global";
import Swal from "sweetalert2";
import {
  CancelOutlined,
  Check,
  Create,
  DeleteForever,
} from "@mui/icons-material";
import { TextField } from "@mui/material";

import { useMenuStore } from "../../../Menu";

export const RowMunicipio = ({
  municipio,
  depto,
  setAgregando,
  busqueda,
}: {
  municipio: Municipio;
  depto: string;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  busqueda?: string;
}) => {
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const themeSwal = useThemeSwal();
  const [editando, setEditando] = useState(!Boolean(municipio._id));
  const esNuevo = useMemo(() => !Boolean(municipio._id), []);
  const config = useMemo(
    () => ({
      name: [required],
    }),
    []
  );
  const propsUseForm = useCallback(
    (item: Municipio) => ({
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
  } = useForm(propsUseForm(municipio), config);

  const onClickEditar = () => {
    if (noTienePermiso("Depto", "update")) return;
    setEditando((prev) => !prev);
    onNewForm(propsUseForm(municipio));
  };
  const handleGuardar = () => {
    socket?.emit(
      SocketEmitMunicipio.agregar,
      { ...formValues, depto },
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        setAgregando!(false);
        // setSliceAgregando(false);
      }
    );
  };
  const handleEditar = () => {
    const itemToEdit: Municipio = { ...municipio, ...formValues };
    socket?.emit(
      SocketEmitMunicipio.editar,
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
    if (noTienePermiso("Depto", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Municipio`,
      text: municipio.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitMunicipio.eliminar,
          { _id: municipio._id, depto },
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
    <StyledTableRow
      key={municipio._id}
      crud={municipio.crud}
      onDoubleClick={() => {
        onClickEditar();
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
              disabled: cargandoSubmit,
              Icon: editando ? CancelOutlined : Create,
              name: `Editar`,
              onClick: onClickEditar,
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
        </>
      ) : (
        <>
          <StyledTableCell>
            {busqueda
              ? useResaltarTexto({ busqueda: busqueda, texto: municipio.name })
              : municipio.name}
          </StyledTableCell>
        </>
      )}
    </StyledTableRow>
  );
};
