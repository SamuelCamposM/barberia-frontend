import { Cancel, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { formatearFecha, handleSocket, required } from "../../../../helpers";
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
import { SocketEmitCompra, calcularTotales, estados } from "../helpers";
import { useCompraStore } from "../hooks/useCompraStore";
import { CompraItem } from "../interfaces";

import { toast } from "react-toastify";
import { DetCompra } from "./DetCompra/DetCompra";
import { getDetCompras } from "./DetCompra/helpers";
import { DetCompraItem, setDataProps } from "./DetCompra/interfaces";
import Swal from "sweetalert2";

export const ModalCompra = () => {
  // Hooks
  const { itemActive, itemDefault, openModal, setItemActive, setOpenModal } =
    useCompraStore();
  const { columns, idModal, vhContainer, width } =
    useModalConfig("modalCompra");
  const { usuario } = useAuthStore();
  const { socket } = useProvideSocket();
  const themeSwal = useThemeSwal();

  const editar = useMemo(() => itemActive._id, [itemActive]);

  // Configuración de validación
  const config = useMemo(
    () => ({
      "proveedor.nombreCompleto": [required],
      estado: [required],
      "sucursal.name": [required],
      detComprasData: [
        (e: DetCompraItem[]) => {
          return e.filter((detCompraItem) => !detCompraItem.crud?.eliminado)
            .length === 0
            ? "Ingrese al menos un detalle de compra"
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
    const formAllData: CompraItem = {
      ...formValues,
      rUsuario: {
        _id: usuario.uid,
        name: usuario.name,
        dui: usuario.dui || "SIN DUI",
      },
      gastoTotal: valuesCompra.dataCompra.gastoTotal,
      totalProductos: valuesCompra.dataCompra.totalProductos,
    };

    socket?.emit(
      SocketEmitCompra.agregar,
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
    const formAllData: CompraItem = {
      ...formValues,
      eUsuario: {
        _id: usuario.uid,
        name: usuario.name,
        dui: usuario.dui || "SIN DUI",
      },
      gastoTotal: valuesCompra.dataCompra.gastoTotal,
      totalProductos: valuesCompra.dataCompra.totalProductos,
    };
    console.log({ formAllData });

    socket?.emit(
      SocketEmitCompra.editar,
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
    } else handleGuardar();
  };

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

  const {
    // agregando,
    // busqueda,
    cargando,
    // setAgregando,
    setCargando,
    setSort,
    sort,
  } = useCommonStates({ asc: true, campo: "_id" });

  const setData = async ({ sort, compra }: setDataProps) => {
    setCargando(true);
    const { error, result } = await getDetCompras({ sort, compra });
    if (error.error) {
      toast.error(error.msg);
    } else {
      setformValues({ ...itemActive, detComprasData: result });
    }
    setCargando(false);
  };

  const valuesCompra = useMemo(() => {
    const { gastoTotal, totalProductos } = calcularTotales(
      formValues.detComprasData
    );
    return {
      id: itemActive._id || "",
      dataCompra: { gastoTotal, totalProductos },
      finalizada: itemActive.estado === "FINALIZADA",
    };
  }, [itemActive.estado, itemActive._id, formValues.detComprasData]);

  useEffect(() => {
    if (itemActive._id) {
      setData({ sort, compra: itemActive._id });
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
              {/* {editar && (
                <Tooltip title="Estado">
                  <Switch
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
              )} */}
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
                {editar && (
                  <TextField
                    label="Estado"
                    disabled={valuesCompra.finalizada}
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
                )}
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
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    disabled={valuesCompra.finalizada}
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
                        label="Proveedor"
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
                    disabled={valuesCompra.finalizada}
                    onChange={(_, newValue) => {
                      if (!newValue) return;
                      setformValues({ ...formValues, sucursal: newValue });
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
                    {errorValues.detComprasData}
                  </Typography>
                  <DetCompra
                    valuesCompra={valuesCompra}
                    detComprasData={formValues.detComprasData}
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
                <IconButton
                  aria-label="Submit"
                  // type="submit"
                  disabled={cargandoSubmit || valuesCompra.finalizada}
                  onClick={onHandleSubmit}
                >
                  <Save />
                </IconButton>
              </Box>
            </StyledModalBoxFooter>
          </form>
        </>
      </ModalLayout>
    </>
  );
};
