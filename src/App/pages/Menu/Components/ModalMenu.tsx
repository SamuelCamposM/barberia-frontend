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
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { ModalLayout, DataAlerta } from "../../../components";
import { PageItem, useMenuStore } from "../index";
import { required, roles } from "../../../../helpers";
import { SocketContext } from "../../../../context";
import { toast } from "react-toastify";
import { useContext, useEffect, useMemo } from "react";
import { useForm } from "../../../../hooks";

export const ModalMenu = () => {
  const { socket } = useContext(SocketContext);
  const { openModal, onToggleOpenMenu, rowActive, setActiveRow, rowDefault } =
    useMenuStore();
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

  const idModal = useMemo(() => "modalMenu", []);
  const columns = useMemo(
    () => ({
      lg: 2,
      md: 2,
      xs: 1,
    }),
    []
  );
  const vhContainer = useMemo(
    () => ({
      height: 60,
      header_height: 40,
      footer_height: 40,
    }),
    []
  );
  const width = useMemo(
    () => ({
      lg: "60",
      md: "80",
      xs: "100",
    }),
    []
  );
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
    // setformValues,
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
      ({ error, msg }: { error: boolean; msg: string }) => {
        if (error) {
          toast.error(<DataAlerta titulo={msg} subtitulo="" enlace="" />, {
            position: "top-center",
          });
        }
        if (!error) {
          toast.success(
            <DataAlerta
              titulo={msg}
              subtitulo={formValues.nombre}
              enlace="sucursal_editado"
            />,
            {
              position: "bottom-right",
            }
          );
          onToggleOpenMenu();
          setActiveRow(rowDefault);
        }
      }
    );
  };

  const awaitActive = async () => {
    await onNewForm(rowActive);
    handleBlur();
  };
  useEffect(() => {
    awaitActive();
  }, [rowActive]);
  return (
    <>
      <ModalLayout
        open={openModal}
        setOpen={onToggleOpenMenu}
        vh={vhContainer.height}
        width={width}
        idModal={idModal}
      >
        <>
          {/* <Box> */}
          <StyledModalBoxHeader>
            <StyledTypographyHeader
              color={isFormInvalid ? "error" : "primary"}
              id={idModal}
            >
              Menu
            </StyledTypographyHeader>
            <Tooltip title="Cancelar">
              <IconButton
                aria-label="Cancelar"
                onClick={onToggleOpenMenu}
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
                  variant="standard"
                  label={"Nombre"}
                  value={formValues.nombre}
                  onChange={handleChange}
                  name="nombre"
                  error={errorValues.nombre.length > 0}
                  helperText={errorValues.nombre.join(" - ")}
                  onBlur={handleBlur}
                />
                <TextField
                  variant="standard"
                  label={"Icono"}
                  value={formValues.icono}
                  onChange={handleChange}
                  name="icono"
                  error={errorValues.icono.length > 0}
                  helperText={errorValues.icono.join(" - ")}
                  onBlur={handleBlur}
                />
                <TextField
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
                  variant="standard"
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
