import { Cancel, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import {
  formatUsuarioForeign,
  formatearFecha,
  handleSocket,
  required,
} from "../../../../helpers";
import { useAuthStore, useForm, useProvideSocket } from "../../../../hooks";
import { ErrorSocket } from "../../../../interfaces/global";
import { ModalLayout } from "../../../components";
import {
  StyledContainerForm,
  StyledGridContainer,
  StyledModalBoxFooter,
  StyledModalBoxHeader,
  StyledTypographyFooter,
  StyledTypographyFooterSpan,
  StyledTypographyHeader,
} from "../../../components/style";
import {
  useCommonStates,
  useDebouncedCallback,
  useHttp,
  useModalConfig,
  useThemeSwal,
} from "../../../hooks";
import { handleNavigation, useFieldProps } from "../../../hooks/useFieldProps";
import { SocketEmitVenta, calcularTotales } from "../helpers";
import { useVentaStore } from "../hooks/useVentaStore";
import { VentaItem } from "../interfaces";

import { toast } from "react-toastify";
import { DetVenta } from "./DetVenta/DetVenta";
import { getDetVentas } from "./DetVenta/helpers";
import { DetVentaItem, setDataProps } from "./DetVenta/interfaces";
import Swal from "sweetalert2";

export const ModalVenta = () => {
  // Hooks
  const { itemActive, itemDefault, openModal, setItemActive, setOpenModal } =
    useVentaStore();
  const { columns, idModal, vhContainer, width } = useModalConfig("modalVenta");
  const { usuario } = useAuthStore();
  const { socket } = useProvideSocket();
  const themeSwal = useThemeSwal();

  const editar = useMemo(() => Boolean(itemActive._id), [itemActive]);

  // Configuración de validación
  const config = useMemo(
    () => ({
      "cliente.name": [required],
      estado: [required],
      "sucursal.name": [required],
      detVentasData: [
        (e: DetVentaItem[]) => {
          return e.filter((detVentaItem) => !detVentaItem.crud?.eliminado)
            .length === 0
            ? "Ingrese al menos un detalle de venta"
            : "";
        },
      ],
    }),
    [editar]
  );

  // Formulario
  const {
    formValues,
    errorValues,
    handleChange,
    setisSubmited,
    isFormInvalid,
    handleBlur,
    isFormInvalidSubmit,
    onNewForm,
    setformValues,
    setCargandoSubmit,
    cargandoSubmit,
  } = useForm(itemDefault, config);

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

  // Funciones de manejo
  const handleGuardar = async () => {
    const formAllData: VentaItem = {
      ...formValues,
      rUsuario: formatUsuarioForeign(usuario),
      gastoTotal: valuesVenta.gastoTotal,
      totalProductos: valuesVenta.totalProductos,
    };

    socket?.emit(
      SocketEmitVenta.agregar,
      formAllData,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        setOpenModal(false);
        setCargandoSubmit(false);
        setItemActive(itemDefault, true);
      }
    );
  };
  const handleEditar = async () => {
    const formAllData: VentaItem = {
      ...formValues,
      eUsuario: formatUsuarioForeign(usuario),
      gastoTotal: valuesVenta.gastoTotal,
      totalProductos: valuesVenta.totalProductos,
    };

    socket?.emit(
      SocketEmitVenta.editar,
      formAllData,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        setOpenModal(false);
        setCargandoSubmit(false);
        setItemActive(itemDefault, true);
      }
    );
  };

  const onHandleSubmit = () => {
    // e.preventDefault();

    setisSubmited(true);
    if (cargandoSubmit) return;
    setCargandoSubmit(true);

    if (isFormInvalidSubmit(formValues)) {
      setCargandoSubmit(false);
      return;
    }

    if (editar) {
      if (formValues.estado) {
        Swal.fire({
          title: "¿Estás listo para finalizar la venta?",
          text: `Estás a punto de finalizar una venta de ${formValues.cliente.lastname} ${formValues.cliente.name} em ${formValues.sucursal.name}. Una vez que se finalice la venta, no podrás realizar más cambios. ¿Estás seguro de que deseas continuar?`,
          icon: "warning",
          confirmButtonText: "Sí, finalizar venta",
          ...themeSwal,
        }).then((result) => {
          if (result.isConfirmed) {
            handleEditar();
          } else {
            setCargandoSubmit(false);
          }
        });
      } else handleEditar();
    } else handleGuardar();
  };

  //Cliente
  const {
    data: dataCliente,
    loading: loadingCliente,
    refetchWithNewBody: RFWNBCliente,
  } = useHttp<VentaItem["cliente"][], { search: string }>({
    initialUrl: "/usuario/searchCliente",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [formValues.cliente],
  });
  const dSearchCliente = useDebouncedCallback(RFWNBCliente);
  //Sucursal
  const {
    data: dataSucursal,
    loading: loadingSucursal,
    refetchWithNewBody: RFWNBSucursal,
  } = useHttp<VentaItem["sucursal"][], { search: string }>({
    initialUrl: "/sucursal/search",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [formValues.sucursal],
  });
  const dSearchSucursal = useDebouncedCallback(RFWNBSucursal);

  const {
    // agregando,
    // busqueda,
    cargando,
    // setAgregando,
    setCargando,
    setSort,
    sort,
  } = useCommonStates({ asc: true, campo: "_id" });

  const setData = async ({ sort, venta }: setDataProps) => {
    setCargando(true);
    const { error, result } = await getDetVentas({ sort, venta });
    if (error.error) {
      toast.error(error.msg);
    } else {
      setformValues({ ...itemActive, detVentasData: result });
    }
    setCargando(false);
  };

  const valuesVenta = useMemo(() => {
    const { gastoTotal, totalProductos } = calcularTotales(
      formValues.detVentasData
    );
    return { gastoTotal, totalProductos };
  }, [formValues.detVentasData]);

  const deshabilitar = useMemo(
    () => itemActive.estado && editar,
    [itemActive.estado, editar]
  );

  useEffect(() => {
    if (itemActive._id) {
      setData({ sort, venta: itemActive._id });
    } else {
      onNewForm({ ...itemActive });
      setCargando(false);
    }
  }, [itemActive]);
  return (
    <>
      <ModalLayout
        idModal={idModal}
        open={openModal}
        setOpen={() => {
          setOpenModal(false);
        }}
        vh={vhContainer.height}
        width={width}
      >
        <>
          <StyledModalBoxHeader>
            <Box display={"flex"} alignItems={"center"}>
              <StyledTypographyHeader
                color={isFormInvalid ? "error" : "primary"}
                id={idModal}
              >
                {editar ? "editando" : "creando"}{" "}
              </StyledTypographyHeader>
              {editar && (
                <Tooltip title="Estado">
                  <Switch
                    disabled={!itemActive.estado}
                    checked={formValues.estado}
                    onChange={(e) => {
                      setformValues({
                        ...formValues,
                        estado: e.target.checked,
                      });
                    }}
                    inputProps={{ "aria-label": "Value" }}
                    color="success"
                  />
                </Tooltip>
              )}
            </Box>
            <Tooltip title="Cancelar">
              <IconButton
                aria-label="Cancelar"
                onClick={() => {
                  setOpenModal(false);
                  // setImage(null);
                }}
                color="error"
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          </StyledModalBoxHeader>
          <form onSubmit={onHandleSubmit}>
            <StyledContainerForm {...vhContainer}>
              <StyledGridContainer {...columns}>
                {/* {editar && (
                  <TextField
                    label="Estado"
                    disabled={deshabilitar}
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
                )} */}
                <Box>
                  <Autocomplete
                    options={
                      dataCliente.length === 0
                        ? [formValues.cliente]
                        : dataCliente
                    }
                    disableClearable={false}
                    value={formValues.cliente}
                    getOptionLabel={(value) => value.name}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    disabled={deshabilitar}
                    onChange={(_, newValue) => {
                      if (!newValue) return;
                      setformValues({ ...formValues, cliente: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...defaultPropsGenerator("cliente.name", true, false)}
                        label="Cliente"
                        autoFocus
                        onChange={({ target }) => {
                          dSearchCliente({ search: target.value });
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
                  {loadingCliente && (
                    <LinearProgress color="primary" variant="query" />
                  )}
                </Box>
                <Box>
                  <Autocomplete
                    options={
                      dataSucursal.length === 0
                        ? [formValues.sucursal]
                        : dataSucursal
                    }
                    disableClearable={false}
                    value={formValues.sucursal}
                    getOptionLabel={(value) => value.name}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    disabled={deshabilitar}
                    onChange={(_, newValue) => {
                      if (!newValue) return;
                      if (formValues.detVentasData.length === 0) {
                        return setformValues({
                          ...formValues,
                          sucursal: newValue,
                        });
                      }
                      Swal.fire({
                        title: "¿Estás seguro de cambiar de sucursal?",
                        text: `La cantidad de los productos se colocará en 0 y se eliminaran los que no tengan registro de stock`,
                        icon: "warning",
                        confirmButtonText: "Sí, cambiar sucursal",
                        ...themeSwal,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setformValues({
                            ...formValues,
                            sucursal: newValue,
                            detVentasData: formValues.detVentasData
                              .filter((detVentaItem) => {
                                return detVentaItem.producto.stocks.some(
                                  (item) => item.sucursal === newValue._id
                                );
                              })
                              .map((detVentaItem) => ({
                                ...detVentaItem,
                                cantidad: 0,
                              })),
                          });
                        } else {
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...defaultPropsGenerator("sucursal.name", true, false)}
                        label="Sucursal"
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

                <Box className="fullWidth" sx={{ overflow: "auto" }}>
                  <Typography variant="overline" color="error">
                    {errorValues.detVentasData}
                  </Typography>
                  <DetVenta
                    deshabilitar={deshabilitar}
                    sucursal_id={formValues.sucursal._id}
                    valuesVenta={valuesVenta}
                    detVentasData={formValues.detVentasData}
                    setformValues={setformValues}
                    setSort={setSort}
                    sort={sort}
                  />
                </Box>
              </StyledGridContainer>
            </StyledContainerForm>
            {(cargando || cargandoSubmit) && (
              <LinearProgress color="primary" variant="query" />
            )}
            <StyledModalBoxFooter>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <StyledTypographyFooter
                  color={isFormInvalid ? "error" : "secondary.light"}
                >
                  C:
                  <Typography className="span" component={"span"}>
                    {formatearFecha(formValues.createdAt)}
                  </Typography>
                </StyledTypographyFooter>
                <StyledTypographyFooter
                  color={isFormInvalid ? "error" : "secondary.light"}
                >
                  E:
                  <Typography className="span" component={"span"}>
                    {formatearFecha(formValues.updatedAt)}
                  </Typography>
                </StyledTypographyFooter>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <StyledTypographyFooterSpan
                  color={isFormInvalid ? "error" : "primary.light"}
                >
                  GUARDAR:
                </StyledTypographyFooterSpan>
                {editar ? (
                  <IconButton
                    aria-label="Submit"
                    // type="submit"
                    disabled={
                      cargandoSubmit ||
                      !itemActive.estado ||
                      !(editar && !formValues.estado)
                    }
                    onClick={onHandleSubmit}
                  >
                    <Save />
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="Submit"
                    // type="submit"
                    disabled={cargandoSubmit}
                    onClick={onHandleSubmit}
                  >
                    <Save />
                  </IconButton>
                )}
              </Box>
            </StyledModalBoxFooter>
          </form>
        </>
      </ModalLayout>
    </>
  );
};
