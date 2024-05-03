import { Acciones } from "../../../components";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { ProveedorItem } from "..";
import { SocketEmitProveedor } from "../helpers";

import { useForm, useProvideSocket } from "../../../../hooks";
import { Dispatch, useMemo } from "react";
import { handleSocket, required, validarEmail } from "../../../../helpers";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { CancelOutlined, Check } from "@mui/icons-material";
import { TextField, Checkbox, Tooltip } from "@mui/material";

import { useMenuStore } from "../../Menu";
import { useFieldProps } from "../../../hooks/useFieldProps";

export const EditableProveedor = ({
  proveedor,
  setAgregando,
  setEditando,
  esNuevo,
  actionsJoins = [],
}: {
  actionsJoins?: Action[];
  proveedor: ProveedorItem;
  esNuevo?: boolean;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const config = useMemo(
    () => ({
      nombreCompleto: [required],
      email: [validarEmail],
      telefono: [required],
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
  } = useForm(proveedor, config);

  const onClickEditar = () => {
    if (noTienePermiso("Proveedor", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando(false);
  };

  const handleGuardar = () => {
    socket?.emit(
      SocketEmitProveedor.agregar,
      { ...formValues },
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        onNewForm(proveedor);
        // setSliceAgregando(false);
      }
    );
  };
  const handleEditar = () => {
    socket?.emit(
      SocketEmitProveedor.editar,
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
    <StyledTableRow key={proveedor._id} crud={proveedor.crud}>
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
        <TextField
          {...defaultPropsGenerator("nombreCompleto", true, true)}
          autoFocus
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField {...defaultPropsGenerator("email", true, true)} />
      </StyledTableCell>
      <StyledTableCell>
        <TextField {...defaultPropsGenerator("telefono", true, true)} />
      </StyledTableCell>
    </StyledTableRow>
  );
};
