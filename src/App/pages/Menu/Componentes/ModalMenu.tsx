import {
  Box,
  Divider,
  Typography,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { ModalLayout } from "../../../components";
import { rowDefault } from "../../../../store/menu";
import { useEffect, useMemo, useState } from "react";
import { useForm, useMenuStore } from "../../../../hooks";
import { required } from "../../../../helpers";
import { roles } from "../../../helpers";
import { Person, Save } from "@mui/icons-material";

export const ModalMenu = () => {
  const { openModal, onToggleOpenMenu, rowActive } = useMenuStore();

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
    onResetForm,
    onNewForm,
    // setformValues,
  } = useForm(rowDefault, config);
  useEffect(() => {
    onNewForm(rowActive);
  }, [rowActive]);
  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setisSubmited(true);
    handleBlur();
    if (isFormInvalidSubmit(formValues)) {
      return;
    }
  };
  const vh = useMemo(() => 60, []);

  return (
    <>
      <ModalLayout open={openModal} setOpen={onToggleOpenMenu} vh={vh}>
        <Box width={"100%"}>
          <Divider textAlign="center">
            <Typography
              variant="h5"
              sx={{
                fontSize: "2rem",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              color={isFormInvalid ? "error" : "primary"}
            >
              {rowActive.nombre}
            </Typography>
          </Divider>
          <Divider />
          <Box component={"form"} onSubmit={onHandleSubmit}>
            <Box
              height={`calc(${vh}vh - ${43 + 22 + 16}px)`}
              p={1}
              overflow={"scroll"}
            >
              <Box display={"flex"} flexWrap={"wrap"} width={"100%"} gap={1}>
                <TextField
                  variant="standard"
                  sx={{
                    flexGrow: 1,
                    flexBasis: (theme) => {
                      return {
                        xs: `calc(100%)`,
                        md: `calc(50% - ${theme.spacing(1)})`,
                      };
                    },
                  }}
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
                  sx={{
                    flexGrow: 1,
                    flexBasis: (theme) => {
                      return {
                        xs: `calc(100%)`,
                        md: `calc(50% - ${theme.spacing(1)})`,
                      };
                    },
                  }}
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
                  sx={{
                    flexGrow: 1,
                    flexBasis: (theme) => {
                      return {
                        xs: `calc(100%)`,
                        md: `calc(50% - ${theme.spacing(1)})`,
                      };
                    },
                  }}
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
                      // style={getStyles(rol, personrol, theme)}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  variant="standard"
                  sx={{
                    flexGrow: 1,
                    flexBasis: (theme) => {
                      return {
                        xs: `calc(100%)`,
                        md: `calc(50% - ${theme.spacing(1)})`,
                      };
                    },
                  }}
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
                      // style={getStyles(rol, personrol, theme)}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  variant="standard"
                  sx={{
                    flexGrow: 1,
                    flexBasis: (theme) => {
                      return {
                        xs: `calc(100%)`,
                        md: `calc(50% - ${theme.spacing(1)})`,
                      };
                    },
                  }}
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
                      // style={getStyles(rol, personrol, theme)}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  variant="standard"
                  sx={{
                    flexGrow: 1,
                    flexBasis: (theme) => {
                      return {
                        xs: `calc(100%)`,
                        md: `calc(50% - ${theme.spacing(1)})`,
                      };
                    },
                  }}
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
                      // style={getStyles(rol, personrol, theme)}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  variant="standard"
                  sx={{
                    flexGrow: 1,
                    flexBasis: (theme) => {
                      return {
                        xs: `calc(100%)`,
                        md: `calc(50% - ${theme.spacing(1)})`,
                      };
                    },
                  }}
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
                      // style={getStyles(rol, personrol, theme)}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  type="number"
                  variant="standard"
                  sx={{
                    flexGrow: 1,
                    flexBasis: (theme) => {
                      return {
                        xs: `calc(100%)`,
                        md: `calc(50% - ${theme.spacing(1)})`,
                      };
                    },
                  }}
                  label={"Orden"}
                  value={formValues.orden}
                  onChange={handleChange}
                  name="orden"
                  error={errorValues.orden.length > 0}
                  helperText={errorValues.orden.join(" - ")}
                  onBlur={handleBlur}
                />
                {/* <TextField
                    variant="standard"
                    sx={{
                      flexGrow: 1,
                      flexBasis: (theme) => {
                        return {
                          xs: `calc(100%)`,
                          md: `calc(50% - ${theme.spacing(1)})`,
                        };
                      },
                    }}
                    key={`${index}`}
                    label={`Campo ${index + 1}`}
                  /> */}
              </Box>
            </Box>
            <Divider />
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "1.5rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
                color={isFormInvalid ? "error" : "secondary"}
              >
                GUARDAR:
              </Typography>
              <IconButton aria-label="Submit" type="submit">
                <Save />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </ModalLayout>
    </>
  );
};
