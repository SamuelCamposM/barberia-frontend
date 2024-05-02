import { Acciones } from "../../../components";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { MarcaItem } from "..";
import { SocketEmitMarca } from "../helpers";

import { useForm, useProvideSocket } from "../../../../hooks";
import { Dispatch, useMemo } from "react";
import { handleSocket, required } from "../../../../helpers";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { CancelOutlined, Check } from "@mui/icons-material";
import { TextField, Checkbox, Tooltip } from "@mui/material";

import { useMenuStore } from "../../Menu";
import { useFieldProps } from "../../../hooks/useFieldProps";

export const EditableMarca = ({
  marca,
  setAgregando,
  setEditando,
  esNuevo,
  actionsJoins = [],
}: {
  actionsJoins?: Action[];
  marca: MarcaItem;
  esNuevo?: boolean;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const config = useMemo(
    () => ({
      name: [required],
      estado: [],
    }),
    []
  );

  const {
    formValues,
    setformValues,
    handleChange,
    errorValues,
    handleBlur,
    isFormInvalidSubmit,
    setisSubmited,
    cargandoSubmit,
    setCargandoSubmit,
    onNewForm,
  } = useForm(marca, config);

  const onClickEditar = () => {
    if (noTienePermiso("Marca", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando(false);
  };

  const handleGuardar = () => {
    socket?.emit(
      SocketEmitMarca.agregar,
      { ...formValues },
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        onNewForm(marca);
        // setSliceAgregando(false);
      }
    );
  };
  const handleEditar = () => {
    socket?.emit(
      SocketEmitMarca.editar,
      formValues,
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

  const { defaultPropsGenerator } = useFieldProps({
    config,
    errorValues,
    formValues,
    handleBlur,
    handleChange,
    handleKeyDown: (e) => {
      if (e.key === "Enter") {
        onSubmit();
      }
      if (e.key === "Escape") {
        onClickEditar();
      }
    },
  });
  return (
    <StyledTableRow key={marca._id} crud={marca.crud}>
      <StyledTableCell padding="checkbox">
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
            ...actionsJoins,
          ]}
        >
          <Tooltip title="Estado" sx={{ display: esNuevo ? "none" : "" }}>
            <Checkbox
              sx={{ p: 0.5, m: 0, display: esNuevo ? "none" : "" }}
              size="small"
              checked={formValues.estado}
              onChange={(e) => {
                setformValues({ ...formValues, estado: e.target.checked });
              }}
              color="primary"
            />
          </Tooltip>
        </Acciones>
      </StyledTableCell>
      <StyledTableCell>
        <TextField {...defaultPropsGenerator("name", true, true)} autoFocus />
      </StyledTableCell>
    </StyledTableRow>
  );
};