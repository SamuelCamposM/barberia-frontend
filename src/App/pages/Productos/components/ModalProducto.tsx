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
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { ModalLayout } from "../../../components";
import {
  formatearFecha,
  handleSocket,
  min,
  PhotoDataMultiple,
  processObject,
  required,
  uploadAllFiles,
} from "../../../../helpers";
import { ArchivoMultiple } from "../../../components";
import { ErrorSocket } from "../../../../interfaces/global";
import { handleNavigation, useFieldProps } from "../../../hooks/useFieldProps";
import { ProductoItem } from "../interfaces";
import { SocketEmitProducto, tiposProducto } from "../helpers";
import { toast } from "react-toastify";
import { useAuthStore, useForm, useProvideSocket } from "../../../../hooks";
import { useDebouncedCallback, useHttp, useModalConfig } from "../../../hooks";
import { useEffect, useMemo, useState } from "react";
import { useProductoStore } from "../hooks/useProductoStore";

export const ModalProducto = () => {
  // Hooks
  const { itemActive, itemDefault, openModal, setItemActive, setOpenModal } =
    useProductoStore();
  const { columns, idModal, vhContainer, width } =
    useModalConfig("modalProducto");
  const { usuario } = useAuthStore();
  const { socket } = useProvideSocket();

  const editar = useMemo(() => itemActive._id, [itemActive]);

  // Configuración de validación
  const config = useMemo(
    () => ({
      photos: [
        (e: string[]) => {
          return e.length === 0 ? "Al menos una imagen requerida" : "";
        },
      ],
      name: [required],
      price: [(value: number) => min(value, 1)],
      "categoria.name": [required],
      "marca.name": [required],
      tipoProducto: [required],
      estado: [],
      rUsuario: [],
      eUsuario: [],
      createdAt: [],
      updatedAt: [],
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
  //Categoria
  const {
    data: dataCategoria,
    loading: loadingCategoria,
    refetchWithNewBody: RFWNBCategoria,
  } = useHttp<ProductoItem["categoria"][], { search: string }>({
    initialUrl: "/categoria/search",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [],
  });
  const dSearchCategoria = useDebouncedCallback(RFWNBCategoria);
  //Marca
  const {
    data: dataMarca,
    loading: loadingMarca,
    refetchWithNewBody: RFWNBMarca,
  } = useHttp<ProductoItem["marca"][], { search: string }>({
    initialUrl: "/marca/search",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [],
  });
  const dSearchMarca = useDebouncedCallback(RFWNBMarca);
  type ItemKeys = keyof ProductoItem;
  const [images, setImages] = useState<{
    [K in ItemKeys]?: PhotoDataMultiple;
  }>({});
  // Funciones de manejo
  const handleGuardar = async () => {
    const { values, error } = await uploadAllFiles(images);

    if (error) {
      toast.error("Hubo un error al subir las imagenes");
      return setCargandoSubmit(false);
    }
    const formAllData: ProductoItem = {
      ...formValues,
      rUsuario: {
        _id: usuario.uid,
        name: `${usuario.lastname} ${usuario.name}`,
        dui: "",
      },
      ...values,
    };

    socket?.emit(
      SocketEmitProducto.agregar,
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
    const { eliminados } = processObject(images);
    const { values, error } = await uploadAllFiles(images);

    if (error) {
      toast.error("Hubo un error al subir las imagenes");
      return setCargandoSubmit(false);
    }
    const formAllData: ProductoItem = {
      ...formValues,
      eUsuario: {
        _id: usuario.uid,
        name: `${usuario.lastname} ${usuario.name}`,
        dui: "",
      },
      ...values,
    };

    socket?.emit(
      SocketEmitProducto.editar,
      { data: formAllData, eliminados },
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
    setImages({
      photos: {
        antiguos: itemActive.photos,
        eliminados: [],
        newFiles: [],
      },
    });
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
                <TextField
                  autoFocus
                  label={"Nombre"}
                  {...defaultPropsGenerator("name", true, true)}
                />
                <TextField
                  type="number"
                  label={"Precio"}
                  {...defaultPropsGenerator("price", true, true)}
                />
                <Box>
                  <Autocomplete
                    options={
                      dataCategoria.length === 0
                        ? [formValues.categoria]
                        : dataCategoria
                    }
                    disableClearable={false}
                    value={formValues.categoria}
                    getOptionLabel={(value) => value.name}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    onChange={(_, newValue) => {
                      if (!newValue) return;
                      setformValues({ ...formValues, categoria: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categoria"
                        {...defaultPropsGenerator(
                          "categoria.name",
                          true,
                          false
                        )}
                        onChange={({ target }) => {
                          dSearchCategoria({ search: target.value });
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
                  {loadingCategoria && (
                    <LinearProgress color="primary" variant="query" />
                  )}
                </Box>
                <Box>
                  <Autocomplete
                    options={
                      dataMarca.length === 0 ? [formValues.marca] : dataMarca
                    }
                    disableClearable={false}
                    value={formValues.marca}
                    getOptionLabel={(value) => value.name}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    onChange={(_, newValue) => {
                      if (!newValue) return;
                      setformValues({ ...formValues, marca: newValue });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Marca"
                        {...defaultPropsGenerator("marca.name", true, false)}
                        onChange={({ target }) => {
                          dSearchMarca({ search: target.value });
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
                  {loadingMarca && (
                    <LinearProgress color="primary" variant="query" />
                  )}
                </Box>
                <TextField
                  type="number"
                  label={"Tipo Producto"}
                  {...defaultPropsGenerator("tipoProducto", true, true)}
                  select
                >
                  {tiposProducto.map((tipoProducto) => (
                    <MenuItem key={tipoProducto} value={tipoProducto}>
                      {tipoProducto}
                    </MenuItem>
                  ))}
                </TextField>
                <ArchivoMultiple<{
                  [K in ItemKeys]?: PhotoDataMultiple;
                }>
                  label="Fotos"
                  propiedad="photos"
                  dataFile={images["photos"]}
                  setDataFile={setImages}
                  //FORM
                  setformValues={setformValues}
                  handleBlur={handleBlur}
                  error={errorValues.photos.length > 0}
                  helperText={errorValues.photos.join(" - ")}
                />
              </StyledGridContainer>
            </StyledContainerForm>
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
