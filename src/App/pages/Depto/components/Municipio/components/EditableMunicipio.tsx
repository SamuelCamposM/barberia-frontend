import { Acciones } from "../../../../../components";
import { StyledTableCell, StyledTableRow } from "../../../../../components/style";
import { MunicipioItem } from "../interfaces";
import { SocketEmitMunicipio } from "../helpers";
import { useForm, useProvideSocket } from "../../../../../../hooks";
import { Dispatch, KeyboardEvent, useMemo } from "react";
import { handleSocket, required } from "../../../../../../helpers";
import { ErrorSocket } from "../../../../../../interfaces/global";
import { CancelOutlined, Check } from "@mui/icons-material";
import { TextField } from "@mui/material";

import { useMenuStore } from "../../../../Menu";

export const EditableMunicipio = ({
  municipio,
  depto,
  setAgregando,
  setEditando,
}: {
  municipio: MunicipioItem;
  depto: string;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const esNuevo = useMemo(() => !Boolean(municipio._id), []);
  const config = useMemo(
    () => ({
      name: [required],
    }),
    []
  );

  const {
    formValues,
    handleChange,
    errorValues,
    handleBlur,
    isFormInvalidSubmit,
    setisSubmited,
    cargandoSubmit,
    setCargandoSubmit,
  } = useForm(municipio, config);

  const onClickEditar = () => {
    if (noTienePermiso("Depto", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando((prev) => !prev);
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
    const itemToEdit: MunicipioItem = { ...municipio, ...formValues };
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
              color: "error",
              disabled: cargandoSubmit,
              Icon: CancelOutlined,
              name: `Editar`,
              onClick: onClickEditar,
              tipo: "icono",
              size: "small",
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
            },
          ]}
        />
      </StyledTableCell>
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
    </StyledTableRow>
  );
};
