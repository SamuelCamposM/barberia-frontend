import { Acciones } from "../../../../../components";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../../../components/style";
import { AttachMoney, CancelOutlined, Check } from "@mui/icons-material";
import { Dispatch, useMemo } from "react";
import { ErrorSocket } from "../../../../../../interfaces/global";
import { handleSocket, required, min } from "../../../../../../helpers";
import { DetCompraItem } from "../interfaces";
import { SocketEmitDetCompra } from "../helpers";
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import { useForm, useProvideSocket } from "../../../../../../hooks";

import { useMenuStore } from "../../../../Menu";
import { useFieldProps } from "../../../../../hooks/useFieldProps";
import { useDebouncedCallback, useHttp } from "../../../../../hooks";

export const EditableDetCompra = ({
  detCompra,
  compra,
  setAgregando,
  setEditando,
}: {
  detCompra: DetCompraItem;
  compra: string;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const esNuevo = useMemo(() => !Boolean(detCompra._id), []);
  const config = useMemo(
    () => ({
      "producto.name": [required],
      cantidad: [(e: number) => min(e, 1)],
      precioUnidad: [(e: number) => min(e, 1)],
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
  } = useForm(detCompra, config);

  const onClickEditar = () => {
    if (noTienePermiso("Compra", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando(false);
  };

  const handleGuardar = () => {
    socket?.emit(
      SocketEmitDetCompra.agregar,
      { ...formValues, compra },
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        onNewForm(detCompra);
        // setSliceAgregando(false);
      }
    );
  };
  const handleEditar = () => {
    const itemToEdit: DetCompraItem = { ...detCompra, ...formValues };
    socket?.emit(
      SocketEmitDetCompra.editar,
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

  const { defaultPropsGenerator } = useFieldProps({
    config,
    errorValues,
    formValues,
    handleBlur,
    handleChange,
    handleKeyDown: (e) => {
      if (e.shiftKey && e.key === "Enter") {
        onSubmit();
      }
      if (e.shiftKey && e.key === "Escape") {
        onClickEditar();
      }
      // handleNavigation(e, config, refs);
    },
  });

  //Producto
  const {
    data: dataProducto,
    loading: loadingProducto,
    refetchWithNewBody: RFWNBProducto,
  } = useHttp<DetCompraItem["producto"][], { search: string }>({
    initialUrl: "/producto/search",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [],
  });
  const dSearchProducto = useDebouncedCallback(RFWNBProducto);

  return (
    <StyledTableRow key={detCompra._id} crud={detCompra.crud}>
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
          ]}
        />
      </StyledTableCell>
      <StyledTableCell>
        <Box>
          <Autocomplete
            options={
              dataProducto.length === 0 ? [formValues.producto] : dataProducto
            }
            disableClearable={false}
            value={formValues.producto}
            getOptionLabel={(value) => value.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            onChange={(_, newValue) => {
              if (!newValue) return;
              setformValues({ ...formValues, producto: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...defaultPropsGenerator("producto.name", true, false)}
                autoFocus
                onChange={({ target }) => {
                  dSearchProducto({ search: target.value });
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
          {loadingProducto && (
            <LinearProgress color="primary" variant="query" />
          )}
        </Box>
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          type="number"
          {...defaultPropsGenerator("cantidad", true, true)}
          onChange={(e) => {
            const value = Math.max(0, Number(e.target.value));
            setformValues({
              ...formValues,
              cantidad: value,
              total: value * formValues.precioUnidad,
            });
          }}
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          type="number"
          {...defaultPropsGenerator("precioUnidad", true, true)}
          onChange={(e) => {
            const value = Math.max(0, Number(e.target.value));
            setformValues({
              ...formValues,
              precioUnidad: value,
              total: value * formValues.cantidad,
            });
          }}
          InputProps={{
            sx: { paddingRight: "0px !important" },
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title={`agregar ${"path"}`}>
                  <AttachMoney />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </StyledTableCell>
      <StyledTableCell>$ {formValues.total}</StyledTableCell>
    </StyledTableRow>
  );
};
