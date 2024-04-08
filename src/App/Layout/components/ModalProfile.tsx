import {
  StyledContainerForm,
  StyledGridContainer,
  StyledModalBoxFooter,
  StyledModalBoxHeader,
  StyledTypographyFooter,
  StyledTypographyFooterSpan,
  StyledTypographyHeader,
} from "../../components/style";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { ModalLayout } from "../../components";
import { formatearFecha, required } from "../../../helpers";
import { useMemo } from "react";
import { useAuthStore, useForm, useUiStore } from "../../../hooks";
import { clienteAxios } from "../../../api";
import { toast } from "react-toastify";
import { useFileUpload } from "../../hooks";
// import { useNavigate } from "react-router-dom"; // import { usePath } from "../../../hooks";
const idModal = "modalMenu";
const columns = { lg: 2, md: 2, xs: 1 };
const vhContainer = {
  height: { lg: "50", md: "60", xs: "90" },
  header_height: 40,
  footer_height: 40,
};
const width = {
  lg: "60",
  md: "70",
  xs: "100",
};

export const ModalProfile = () => {
  const { setOpenProfileModal, openModalProfile } = useUiStore();
  const { user, onEditUser } = useAuthStore();
  const config = useMemo(
    () => ({
      email: [required],
      lastname: [required],
      name: [required],
      tel: [required],
      photo: [],
    }),
    []
  );
  const {
    formValues,
    errorValues,
    handleChange,
    setisSubmited,
    isFormInvalid,
    handleBlur,
    isFormInvalidSubmit,
    // onResetForm,
    onNewForm,
    setformValues,
    cargando,
    setcargando,
  } = useForm(user, config);

  const { ComponentUpload, onSubmitUpload } = useFileUpload({
    label: "Foto de perfil",
    prevUrl: formValues.photo || "",
    propiedad: "photo",
    error: errorValues.photo.length > 0,
    helperText: errorValues.photo.join(" - "),
    setformValues,
  });
  
  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cargando) return;
    setisSubmited(true);
    handleBlur();
    try {
      setcargando(true);
      //SUBIR IMAGEN
      const {
        data,
        config: { eliminado, prevUrl, error },
      } = await onSubmitUpload();

      if (error) {
        return toast.error(error);
      }
      const formAllData = {
        ...formValues,
        ...data,
      };

      if (isFormInvalidSubmit(formAllData)) {
        return;
      }
      //SI CUMPLE LAS CONDICIONES PASA A ACTUALIZAR
      await clienteAxios.post("/auth/edit", {
        data: formAllData,
        prevUrl: eliminado ? prevUrl : "",
      });
      onEditUser(formAllData);
      toast.success("¡Actualizado con exito!");
      setcargando(false);
      setOpenProfileModal(false);
    } catch (error) {
      setcargando(false);
      toast.error("¡No se pudieron actualizar los datos!");
    }
  };

  return (
    <>
      <ModalLayout
        idModal={idModal}
        open={openModalProfile}
        setOpen={() => {
          setOpenProfileModal(false);
        }}
        vh={vhContainer.height}
        width={width}
      >
        <>
          <StyledModalBoxHeader>
            <StyledTypographyHeader
              color={isFormInvalid ? "error" : "primary"}
              id={idModal}
            >
              MIS DATOS
            </StyledTypographyHeader>
            <Tooltip title="Cancelar">
              <IconButton
                aria-label="Cancelar"
                onClick={() => {
                  setOpenProfileModal(false);
                  onNewForm(user);
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
                  label={"Apellido"}
                  value={formValues.lastname}
                  onChange={handleChange}
                  name="lastname"
                  error={errorValues.lastname.length > 0}
                  helperText={errorValues.lastname.join(" - ")}
                  onBlur={handleBlur}
                />
                <TextField
                  label={"Nombre"}
                  value={formValues.name}
                  onChange={handleChange}
                  name="name"
                  error={errorValues.name.length > 0}
                  helperText={errorValues.name.join(" - ")}
                  onBlur={handleBlur}
                />
                <TextField
                  label={"Correo"}
                  value={formValues.email}
                  onChange={handleChange}
                  name="email"
                  error={errorValues.email.length > 0}
                  helperText={errorValues.email.join(" - ")}
                  onBlur={handleBlur}
                />
                <TextField
                  label={"Tel"}
                  value={formValues.tel}
                  onChange={handleChange}
                  name="tel"
                  error={errorValues.tel.length > 0}
                  helperText={errorValues.tel.join(" - ")}
                  onBlur={handleBlur}
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
                    {formatearFecha(user.createdAt)}
                  </Typography>
                </StyledTypographyFooter>
                <StyledTypographyFooter
                  color={isFormInvalid ? "error" : "secondary.light"}
                >
                  E:
                  <Typography className="span" component={"span"}>
                    {formatearFecha(user.updatedAt)}
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
                  disabled={cargando}
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
