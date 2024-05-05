import { Acciones } from "../../../components";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { CompraItem } from "..";
import { SocketEmitCompra, estados } from "../helpers";

import { useAuthStore, useForm, useProvideSocket } from "../../../../hooks";
import { Dispatch, useMemo } from "react";
import { handleSocket, required } from "../../../../helpers";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { CancelOutlined, Check } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";

import { useMenuStore } from "../../Menu";
import { useDebouncedCallback, useHttp, useThemeSwal } from "../../../hooks";
import { handleNavigation, useFieldProps } from "../../../hooks/useFieldProps";
import Swal from "sweetalert2";

export const EditableCompra = ({
  compra,
  setAgregando,
  setEditando,
  esNuevo,
  actionsJoins = [],
}: {
  actionsJoins?: Action[];
  compra: CompraItem;
  esNuevo?: boolean;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { noTienePermiso } = useMenuStore();
  const { usuario } = useAuthStore();
  const { socket } = useProvideSocket();
  const themeSwal = useThemeSwal();
  const config = useMemo(
    () => ({
      "proveedor.nombreCompleto": [required],
      estado: [required],
      "sucursal.name": [required],
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
    onNewForm,
    setformValues,
  } = useForm(compra, config);

  const onClickEditar = () => {
    if (noTienePermiso("Compra", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando(false);
  };

  const handleGuardar = () => {
    socket?.emit(
      SocketEmitCompra.agregar,
      {
        ...formValues,
        rUsuario: {
          _id: usuario.uid,
          dui: usuario.dui,
          name: usuario.name,
        },
      },
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        onNewForm(compra);
        setAgregando!(false);
      }
    );
  };
  const handleEditar = () => {
    socket?.emit(
      SocketEmitCompra.editar,
      {
        ...formValues,
        eUsuario: {
          _id: usuario.uid,
          dui: usuario.dui,
          name: usuario.name,
        },
      },
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
      if (formValues.estado === "FINALIZADA") {
        Swal.fire({
          title: "¿Estás listo para finalizar la compra?",
          text: `Estás a punto de finalizar una compra de ${formValues.proveedor.nombreCompleto} destinada a ${formValues.sucursal.name}. Una vez que se finalice la compra, no podrás realizar más cambios. ¿Estás seguro de que deseas continuar?`,
          icon: "warning",
          confirmButtonText: "Sí, finalizar compra",
          ...themeSwal,
        }).then((result) => {
          if (result.isConfirmed) {
            handleEditar();
          } else {
            setCargandoSubmit(false);
          }
        });
      } else handleEditar();
    }
  };
  const { defaultPropsGenerator, refs } = useFieldProps({
    config,
    errorValues,
    formValues,
    handleBlur,
    handleChange,
    handleKeyDown: (e) => {
      handleNavigation(e, config, refs);
    },
  });
  //Proveedor
  const {
    data: dataProveedor,
    loading: loadingProveedor,
    refetchWithNewBody: RFWNBProveedor,
  } = useHttp<CompraItem["proveedor"][], { search: string }>({
    initialUrl: "/proveedor/search",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [],
  });
  const dSearchProveedor = useDebouncedCallback(RFWNBProveedor);
  //Sucursal
  const {
    data: dataSucursal,
    loading: loadingSucursal,
    refetchWithNewBody: RFWNBSucursal,
  } = useHttp<CompraItem["sucursal"][], { search: string }>({
    initialUrl: "/sucursal/search",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [],
  });
  const dSearchSucursal = useDebouncedCallback(RFWNBSucursal);

  return (
    <StyledTableRow key={compra._id} crud={compra.crud}>
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
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          {...defaultPropsGenerator("estado", true, true)}
          autoFocus
          select
        >
          {estados.map((estado) => (
            <MenuItem key={estado} value={estado}>
              {estado}
            </MenuItem>
          ))}
        </TextField>
      </StyledTableCell>
      <StyledTableCell>
        <Box>
          <Autocomplete
            options={
              dataProveedor.length === 0
                ? [formValues.proveedor]
                : dataProveedor
            }
            disableClearable={false}
            value={formValues.proveedor}
            getOptionLabel={(value) => value.nombreCompleto}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(_, newValue) => {
              if (!newValue) return;
              setformValues({ ...formValues, proveedor: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...defaultPropsGenerator(
                  "proveedor.nombreCompleto",
                  true,
                  false
                )}
                onChange={({ target }) => {
                  dSearchProveedor({ search: target.value });
                }}
                InputProps={{
                  ...params.InputProps,
                  sx: { paddingRight: "0px !important" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={`agregar ${"path"}`}>
                        <IconButton
                          aria-label=""
                          onClick={() => {
                            // navigate(path);
                          }}
                        >
                          {/* {Icono} */}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          {loadingProveedor && (
            <LinearProgress color="primary" variant="query" />
          )}
        </Box>
      </StyledTableCell>
      <StyledTableCell>
        <Box>
          <Autocomplete
            options={
              dataSucursal.length === 0 ? [formValues.sucursal] : dataSucursal
            }
            disableClearable={false}
            value={formValues.sucursal}
            getOptionLabel={(value) => value.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(_, newValue) => {
              if (!newValue) return;
              setformValues({ ...formValues, sucursal: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...defaultPropsGenerator("sucursal.name", true, false)}
                onChange={({ target }) => {
                  dSearchSucursal({ search: target.value });
                }}
                InputProps={{
                  ...params.InputProps,
                  sx: { paddingRight: "0px !important" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={`agregar ${"path"}`}>
                        <IconButton
                          aria-label=""
                          onClick={() => {
                            // navigate(path);
                          }}
                        >
                          {/* {Icono} */}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          {loadingSucursal && (
            <LinearProgress color="primary" variant="query" />
          )}
        </Box>
      </StyledTableCell>
      <StyledTableCell> {usuario.name}</StyledTableCell>
    </StyledTableRow>
  );
};
