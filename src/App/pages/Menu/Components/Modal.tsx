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
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { ModalLayout } from "../../../components";
import { PageItem, useMenuStore } from "../index";
import {
  ConvertirIcono,
  handleSocket,
  required,
  roles,
} from "../../../../helpers";
import { SocketContext } from "../../../../context";
import { useContext, useEffect, useMemo } from "react";
import { useForm } from "../../../../hooks";
import { IconosFiltered } from "../helpers";

import { ErrorSocket } from "../../../../interfaces/global";
// import { useNavigate } from "react-router-dom";
// import { usePath } from "../../../hooks";
const idModal = "modalMenu";
const columns = {
  lg: 2,
  md: 2,
  xs: 1,
};
const vhContainer = {
  height: {
    lg: "50",
    md: "60",
    xs: "80",
  },
  header_height: 40,
  footer_height: 40,
};
const width = {
  lg: "40",
  md: "70",
  xs: "100",
};

export const ModalMenu = () => {
  const { socket } = useContext(SocketContext);
  const { openModal, setOpenModalMenu, rowActive, setActiveRow, rowDefault } =
    useMenuStore();
  const editar = useMemo(() => Boolean(rowActive._id), [rowActive]);
  const propsUseForm = (item: PageItem) => {
    return {
      nombre: item.nombre,
      icono: item.icono,
      insert: item.insert,
      delete: item.delete,
      update: item.update,
      select: item.select,
      ver: item.ver,
      orden: item.orden,
    };
  };

  const config = useMemo(
    () => ({
      nombre: [required],
      icono: [required],
      insert: [required],
      delete: [required],
      update: [required],
      select: [required],
      ver: [required],
      orden: [required],
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
  } = useForm(propsUseForm(rowDefault), config);

  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setisSubmited(true);
    handleBlur();

    if (isFormInvalidSubmit(formValues)) {
      return;
    }

    socket?.emit(
      "server:page-editar",
      formValues,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg, subtitulo: formValues.nombre });
        if (error) return;

        setOpenModalMenu(false);
        setActiveRow(rowDefault);
      }
    );
  };

  // const awaitActive = async () => {
  //   await ;

  //   handleBlur();
  // };
  useEffect(() => {
    onNewForm(rowActive);
  }, [rowActive]);

  return (
    <>
      <ModalLayout
        idModal={idModal}
        open={openModal}
        setOpen={() => setOpenModalMenu(false)}
        vh={vhContainer.height}
        width={width}
      >
        <>
          <StyledModalBoxHeader>
            <StyledTypographyHeader
              color={isFormInvalid ? "error" : "primary"}
              id={idModal}
            >
              Menu: {editar ? "editando" : "agregando"}
            </StyledTypographyHeader>
            <Tooltip title="Cancelar">
              <IconButton
                aria-label="Cancelar"
                onClick={() => setOpenModalMenu(false)}
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
                  label={"Nombre"}
                  value={formValues.nombre}
                  onChange={handleChange}
                  name="nombre"
                  error={errorValues.nombre.length > 0}
                  helperText={errorValues.nombre.join(" - ")}
                  onBlur={handleBlur}
                />

                <Autocomplete
                  options={IconosFiltered}
                  getOptionLabel={(nombreIcono) =>
                    nombreIcono.replace("Rounded", "")
                  }
                  value={formValues.icono === "" ? null : formValues.icono}
                  onChange={(_, newValue) => {
                    if (!newValue) return;

                    setformValues((prev) => ({ ...prev, icono: newValue }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={"Icono"}
                      error={errorValues.icono.length > 0}
                      helperText={errorValues.icono.join(" - ")}
                      onBlur={handleBlur}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Ver iconos">
                              <IconButton
                                aria-label=""
                                onClick={() => {
                                  window.open("https://fonts.google.com/icons");
                                }}
                              >
                                {ConvertirIcono(formValues.icono)}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <TextField
                  label={"Insert"}
                  value={formValues.insert}
                  onChange={handleChange}
                  name="insert"
                  error={errorValues.insert.length > 0}
                  helperText={errorValues.insert.join(" - ")}
                  onBlur={handleBlur}
                  select
                  SelectProps={{ multiple: true }}
                >
                  {roles.map((rol) => (
                    <MenuItem
                      key={rol}
                      value={rol}
                      sx={{
                        fontWeight: formValues.insert.includes(rol)
                          ? "bold"
                          : "",
                      }}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label={"Delete"}
                  value={formValues.delete}
                  onChange={handleChange}
                  name="delete"
                  error={errorValues.delete.length > 0}
                  helperText={errorValues.delete.join(" - ")}
                  onBlur={handleBlur}
                  select
                  SelectProps={{ multiple: true }}
                >
                  {roles.map((rol) => (
                    <MenuItem
                      key={rol}
                      value={rol}
                      sx={{
                        fontWeight: formValues.delete.includes(rol)
                          ? "bold"
                          : "",
                      }}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label={"Update"}
                  value={formValues.update}
                  onChange={handleChange}
                  name="update"
                  error={errorValues.update.length > 0}
                  helperText={errorValues.update.join(" - ")}
                  onBlur={handleBlur}
                  select
                  SelectProps={{ multiple: true }}
                >
                  {roles.map((rol) => (
                    <MenuItem
                      key={rol}
                      value={rol}
                      sx={{
                        fontWeight: formValues.update.includes(rol)
                          ? "bold"
                          : "",
                      }}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label={"Select"}
                  value={formValues.select}
                  onChange={handleChange}
                  name="select"
                  error={errorValues.select.length > 0}
                  helperText={errorValues.select.join(" - ")}
                  onBlur={handleBlur}
                  select
                  SelectProps={{ multiple: true }}
                >
                  {roles.map((rol) => (
                    <MenuItem
                      key={rol}
                      value={rol}
                      sx={{
                        fontWeight: formValues.select.includes(rol)
                          ? "bold"
                          : "",
                      }}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label={"Ver"}
                  value={formValues.ver}
                  onChange={handleChange}
                  name="ver"
                  error={errorValues.ver.length > 0}
                  helperText={errorValues.ver.join(" - ")}
                  onBlur={handleBlur}
                  select
                  SelectProps={{ multiple: true }}
                >
                  {roles.map((rol) => (
                    <MenuItem
                      key={rol}
                      value={rol}
                      sx={{
                        fontWeight: formValues.ver.includes(rol) ? "bold" : "",
                      }}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type="number"
                  label={"Orden"}
                  value={formValues.orden}
                  onChange={handleChange}
                  name="orden"
                  error={errorValues.orden.length > 0}
                  helperText={errorValues.orden.join(" - ")}
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
                  <Typography component={"span"}> Samuel Campos</Typography>
                </StyledTypographyFooter>
                <StyledTypographyFooter
                  color={isFormInvalid ? "error" : "secondary.light"}
                >
                  E:
                  <Typography component={"span"}> Samuel Campos</Typography>
                </StyledTypographyFooter>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <StyledTypographyFooterSpan
                  color={isFormInvalid ? "error" : "primary.light"}
                >
                  GUARDAR:
                </StyledTypographyFooterSpan>
                <IconButton aria-label="Submit" type="submit">
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
