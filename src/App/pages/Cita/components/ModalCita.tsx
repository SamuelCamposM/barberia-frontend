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
import { Cancel, Save } from "@mui/icons-material";
import { ModalLayout } from "../../../components";
import {
  formatearFecha,
  formatUsuarioForeign,
  handleSocket,
  required,
} from "../../../../helpers";
import { ErrorSocket } from "../../../../interfaces/global";
import { handleNavigation, useFieldProps } from "../../../hooks/useFieldProps";
import { CitaItem } from "../interfaces";
import { SocketEmitCita, estadosCita } from "../helpers";
import { useAuthStore, useForm, useProvideSocket } from "../../../../hooks";
import { useDebouncedCallback, useHttp, useModalConfig } from "../../../hooks";
import { useEffect, useMemo } from "react";
import { useCitaStore } from "../hooks/useCitaStore";
import { format } from "date-fns";

export const ModalCita = () => {
  // Hooks
  const { itemActive, itemDefault, openModal, setItemActive, setOpenModal } =
    useCitaStore();
  const { columns, idModal, vhContainer, width } = useModalConfig("modalCita");
  const { usuario } = useAuthStore();
  const { socket } = useProvideSocket();

  const editar = useMemo(() => itemActive._id, [itemActive]);

  // Configuración de validación
  const config = useMemo(
    () => ({
      "sucursal.name": [required],
      "empleado.lastname": [required],
      titulo: [required],
      estadoCita: [required],
      fecha: [required],
      description: [],
      // rUsuario: [],
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
  // Carga de archivos

  //Autocompletes

  // Funciones de manejo
  const handleGuardar = async () => {
    const formAllData: CitaItem = {
      ...formValues,
      rUsuario: formatUsuarioForeign(usuario),
    };

    socket?.emit(
      SocketEmitCita.agregar,
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
    socket?.emit(
      SocketEmitCita.editar,
      { data: formValues },
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

  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setisSubmited(true);
    if (cargandoSubmit) return;
    setCargandoSubmit(true);

    if (isFormInvalidSubmit({ ...formValues })) {
      setCargandoSubmit(false);
      return;
    }
    if (editar) handleEditar();
    else handleGuardar();
  };

  // Efectos secundarios
  useEffect(() => {
    onNewForm({ ...itemActive });
  }, [itemActive]);
  //Sucursal
  const {
    data: dataSucursal,
    loading: loadingSucursal,
    refetchWithNewBody: RFWNBSucursal,
  } = useHttp<CitaItem["sucursal"][], { search: string }>({
    initialUrl: "/sucursal/search",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [],
  });
  const dSearchSucursal = useDebouncedCallback(RFWNBSucursal);
  //Empleado
  const {
    data: dataEmpleado,
    loading: loadingEmpleado,
    refetchWithNewBody: RFWNBEmpleado,
  } = useHttp<CitaItem["empleado"][], { search: string; sucursal: string }>({
    initialUrl: "/usuario/searchEmpleadoBySucursal",
    initialMethod: "post",
    initialBody: {
      search: "",
      sucursal: "",
    },
    initialData: [],
  });
  const dSearchEmpleado = useDebouncedCallback(RFWNBEmpleado);

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
                {/* <TextField
                  autoFocus
                  label={"Nombre"}
                  {...defaultPropsGenerator("empleado.lastname", true, true)}
                />
                <TextField
                   
                  label={"Nombre"}
                  {...defaultPropsGenerator("sucursal.name", true, true)}
                /> */}
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
                    onChange={(_, newValue) => {
                      if (!newValue) return;
                      setformValues({
                        ...formValues,
                        sucursal: newValue,
                        empleado: itemDefault.empleado,
                      });
                      dSearchEmpleado({
                        search: "",
                        sucursal: newValue._id,
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...defaultPropsGenerator("sucursal.name", true, false)}
                        label="Sucursal"
                        autoFocus
                        onChange={({ target }) => {
                          dSearchSucursal({
                            search: target.value,
                          });
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
                <Box>
                  <Autocomplete
                    options={
                      dataEmpleado.length === 0
                        ? [formValues.empleado]
                        : dataEmpleado
                    }
                    disabled={formValues.sucursal.name === ""}
                    disableClearable={false}
                    value={formValues.empleado}
                    getOptionLabel={(value) =>
                      `${value.lastname} ${value.name}`.trim()
                    }
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    onChange={(_, newValue) => {
                      if (!newValue) return;
                      setformValues({ ...formValues, empleado: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...defaultPropsGenerator(
                          "empleado.lastname",
                          true,
                          false
                        )}
                        label="Empleado"
                        onChange={({ target }) => {
                          dSearchEmpleado({
                            search: target.value,
                            sucursal: formValues.sucursal._id,
                          });
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
                  {loadingEmpleado && (
                    <LinearProgress color="primary" variant="query" />
                  )}
                </Box>
                <TextField
                  label={"Título"}
                  {...defaultPropsGenerator("titulo", true, true)}
                />
                <TextField
                  label={"Estado"}
                  {...defaultPropsGenerator("estadoCita", true, true)}
                  select
                >
                  {estadosCita.map((estadoCita) => (
                    <MenuItem key={estadoCita} value={estadoCita}>
                      {estadoCita}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label={"Fecha"}
                  type="date"
                  {...defaultPropsGenerator("fecha", true, true)}
                  value={formValues.fecha.split("T")[0]}
                  onChange={(e) => {
                    const fechaConMinutos = new Date(e.target.value);
                    const fechaSinMinutos = format(
                      fechaConMinutos,
                      "yyyy-MM-dd'T'HH:00"
                    );

                    setformValues({ ...formValues, fecha: fechaSinMinutos });
                  }}
                />
                {/* {formValues.fecha} // 2024-05-31T18:00 */}
                <TextField
                  label={"Hora"}
                  type="number"
                  {...defaultPropsGenerator("fecha", true, true)}
                  value={formValues.fecha.split("T")[1].split(":")[0]} // Extrae la hora de la fecha
                  onChange={(e) => {
                    const hora = Math.min(
                      Math.max(Number(e.target.value), 1),
                      23
                    );
                    // Asegúrate de que la hora siempre tenga dos dígitos
                    const horaFormateada = hora.toString().padStart(2, "0");
                    const fecha = formValues.fecha.split("T")[0];
                    setformValues({
                      ...formValues,
                      fecha: `${fecha}T${horaFormateada}:00`,
                    });
                  }}
                />

                <TextField
                  multiline
                  className="fullWidth"
                  variant="outlined"
                  label={"Descripción"}
                  minRows={3}
                  {...defaultPropsGenerator("description", true, true)}
                />
              </StyledGridContainer>
            </StyledContainerForm>
            {cargandoSubmit && (
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
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <StyledTypographyFooterSpan
                  color={isFormInvalid ? "error" : "primary.light"}
                >
                  GUARDAR:
                </StyledTypographyFooterSpan>
                <IconButton
                  aria-label="Submit"
                  type="submit"
                  disabled={cargandoSubmit}
                >
                  <Save />
                </IconButton>
              </Box>
            </StyledModalBoxFooter>
          </form>

          {/* </Box> */}
        </>
      </ModalLayout>
    </>
  );
};
