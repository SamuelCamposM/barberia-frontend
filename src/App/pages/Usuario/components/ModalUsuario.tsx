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
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  MenuItem,
  Switch,
} from "@mui/material";
import { Cancel, Save, Visibility, VisibilityOff } from "@mui/icons-material";
import { ModalLayout } from "../../../components";
import {
  formatearFecha,
  handleSocket,
  minNoRequired,
  procesarDocsValues,
  procesarDocsValuesUpload,
  required,
  roles,
  validarEmail,
} from "../../../../helpers";
import { useEffect, useMemo, useState } from "react";
import { useForm, useProvideSocket } from "../../../../hooks";
import { toast } from "react-toastify";
import { useFileUpload, useModalConfig } from "../../../hooks";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { ErrorSocket } from "../../../../interfaces/global";
import { SocketEmitUsuario } from "../helpers";
import { handleNavigation, useFieldProps } from "../../../hooks/useFieldProps";

export const ModalUsuario = () => {
  // Hooks
  const { itemActive, itemDefault, openModal, setItemActive, setOpenModal } =
    useUsuarioStore();
  const { columns, idModal, vhContainer, width } =
    useModalConfig("modalUsuario");
  const { socket } = useProvideSocket();

  const editar = useMemo(() => itemActive._id, [itemActive]);
  const [showPass, setShowPass] = useState(false);

  // Configuración de validación
  const config = useMemo(
    () => ({
      lastname: [required],
      name: [required],
      email: [validarEmail],
      tel: [required],
      photo: [],
      newPassword: editar
        ? [(value: string) => minNoRequired(value, 6)]
        : [required, (value: string) => minNoRequired(value, 6)],
      rol: [required],
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
  } = useForm({ ...itemDefault, newPassword: "" }, config);

  const { ComponentUpload, onSubmitUpload, getValues } = useFileUpload({
    label: "Foto de perfil",
    prevUrl: formValues.photo || "",
    propiedad: "photo",
    error: errorValues.photo.length > 0,
    helperText: errorValues.photo.join(" - "),
    setformValues,
  });

  // Funciones de manejo
  const handleGuardar = async () => {
    const onSubmitUploadFunctions = [onSubmitUpload()];
    const docsUrls = await Promise.all(onSubmitUploadFunctions);
    const { error, uploadProperties } = procesarDocsValuesUpload(docsUrls);

    if (error) {
      setCargandoSubmit(false);
      return toast.error(error);
    }

    const formAllData = {
      ...formValues,
      ...uploadProperties,
    };

    socket?.emit(
      SocketEmitUsuario.agregar,
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
  const handleEditar = async (eliminados: string[]) => {
    const onSubmitUploadFunctions = [onSubmitUpload()];
    const docsUrls = await Promise.all(onSubmitUploadFunctions);
    const { error, uploadProperties } = procesarDocsValuesUpload(docsUrls);

    if (error) {
      setCargandoSubmit(false);
      return toast.error(error);
    }

    const formAllData = {
      ...formValues,
      ...uploadProperties,
    };

    socket?.emit(
      SocketEmitUsuario.editar,
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
    const docsValues = [getValues()];
    const { eliminados, values } = procesarDocsValues(docsValues);

    if (isFormInvalidSubmit({ ...formValues, ...values })) {
      setCargandoSubmit(false);
      return;
    }

    if (editar) handleEditar(eliminados);
    else handleGuardar();
  };

  // Efectos secundarios
  useEffect(() => {
    onNewForm({ ...itemActive, newPassword: "" });
  }, [itemActive]);

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
                {ComponentUpload}
                <TextField
                  autoFocus
                  label={"Apellido"}
                  {...defaultPropsGenerator("lastname", true, true)}
                />
                <TextField
                  label={"Nombre"}
                  {...defaultPropsGenerator("name", true, true)}
                />
                <TextField
                  label={"Correo"}
                  {...defaultPropsGenerator("email", true, true)}
                />
                <TextField
                  label={"Tel"}
                  {...defaultPropsGenerator("tel", true, true)}
                />
                <TextField
                  label={"Rol"}
                  {...defaultPropsGenerator("rol", true, true)}
                  select
                >
                  {roles.map((rol) => (
                    <MenuItem key={rol} value={rol}>
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  type={showPass ? "text" : "password"}
                  label={"Password"}
                  {...defaultPropsGenerator("newPassword", true, true)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle-mostrar-contraseña"
                          onClick={() => {
                            setShowPass(!showPass);
                          }}
                        >
                          {showPass ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
