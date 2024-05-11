import { Acciones } from "../../../../../components";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../../../components/style";
import { AttachMoney, CancelOutlined, Check } from "@mui/icons-material";
import { Dispatch, useMemo } from "react";
import { required, min } from "../../../../../../helpers";
import { DetVentaItem } from "../interfaces";
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import { useForm } from "../../../../../../hooks";

import { useMenuStore } from "../../../../Menu";
import {
  handleNavigation,
  useFieldProps,
} from "../../../../../hooks/useFieldProps";
import { useDebouncedCallback, useHttp } from "../../../../../hooks";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import { VentaItem } from "../../../interfaces";

export const EditableDetVenta = ({
  detVenta,
  setAgregando,
  setEditando,
  setformValues: setVentaValues,
  finalizada,
}: {
  detVenta: DetVentaItem;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  setformValues: Dispatch<React.SetStateAction<VentaItem>>;
  finalizada: boolean;
}) => {
  const { noTienePermiso } = useMenuStore();
  const esNuevo = useMemo(() => !Boolean(detVenta._id), []);
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
  } = useForm(detVenta, config);

  const onClickEditar = () => {
    if (noTienePermiso("Venta", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando(false);
  };

  const handleGuardar = () => {
    const itemToSave: DetVentaItem = {
      ...formValues,
      _id: `nuevo-${v4()}`,
      crud: { nuevo: true },
    };
    setVentaValues((prev) => {
      const existeProducto = prev.detVentasData.some(
        (detVentaItem) =>
          detVentaItem.producto._id === itemToSave.producto._id
      );
      if (existeProducto) {
        toast.error("Este producto ya se encuentra en la venta");

        setTimeout(() => {
          refs["producto.name"].current?.focus();
          setCargandoSubmit(false);
        }, 0);
        return prev;
      } else {
        setTimeout(() => {
          onNewForm(detVenta);
          refs["producto.name"].current?.focus();
          setAgregando!(false);
          setCargandoSubmit(false);
        }, 0);
        return {
          ...prev,
          detVentasData: [itemToSave, ...prev.detVentasData],
        };
      }
    });
  };
  const handleEditar = () => {
    setVentaValues((prev) => {
      const existeProducto = prev.detVentasData.some(
        (detVentaItem) =>
          detVentaItem.producto._id === formValues.producto._id &&
          detVentaItem._id !== formValues._id
      );
      if (existeProducto) {
        toast.error("Este producto ya se encuentra en la venta");

        setTimeout(() => {
          setCargandoSubmit(false);
        }, 0);
        return prev;
      } else {
        setTimeout(() => {
          setEditando(false);
          setCargandoSubmit(false);
        }, 0);
        return {
          ...prev,
          detVentasData: prev.detVentasData.map((item) =>
            item._id === formValues._id
              ? {
                  ...formValues,
                  crud: formValues.crud?.nuevo
                    ? { nuevo: true }
                    : { editado: true },
                }
              : item
          ),
        };
      }
    });
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

  const { defaultPropsGenerator, refs } = useFieldProps({
    config,
    errorValues,
    formValues,
    handleBlur,
    handleChange,
    handleKeyDown: (e) => {
      handleNavigation(e, config, refs);

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
  } = useHttp<DetVentaItem["producto"][], { search: string }>({
    initialUrl: "/producto/search",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [],
  });
  const dSearchProducto = useDebouncedCallback(RFWNBProducto);

  return (
    <StyledTableRow key={detVenta._id} crud={detVenta.crud}>
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: "error",
              disabled: cargandoSubmit || finalizada,
              Icon: CancelOutlined,
              name: `Editar`,
              onClick: onClickEditar,
              tipo: "icono",
              size: "small",
            },
            {
              color: "success",
              disabled: cargandoSubmit || finalizada,
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
