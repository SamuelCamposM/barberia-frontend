import { TextField, Box, Typography } from "@mui/material";
import { useAuthStore, useForm } from "../../hooks";
import Button from "@mui/material/Button";
import { AuthLayout } from "../Layout/AuthLayout";
import { useMemo, useEffect } from "react";
import { required, validarEmail } from "../../helpers";
import { Link } from "react-router-dom";

interface RegisterInterface {
  [key: string]: string | string[] | number;
  email: string;
  lastname: string;
  name: string;
  password: string;
  password2: string;
  tel: string;
}

export const RegisterPage = () => {
  const initialValues = useMemo<RegisterInterface>(
    () => ({
      email: "",
      lastname: "",
      name: "",
      password: "",
      password2: "",
      tel: "",
    }),
    []
  );

  const config = useMemo(
    () => ({
      name: [required],
      email: [required, validarEmail],
      password: [
        required,
        (a: string | string[] | number, b: RegisterInterface) => {
          if (a !== b.password2) {
            return "Las contraseñas no coinciden";
          }
          return "";
        },
      ],
      password2: [
        required,
        (a: string | string[] | number, b: RegisterInterface) => {
          if (a !== b.password) {
            return "Las contraseñas no coinciden";
          }
          return "";
        },
      ],
      lastname: [required],
      tel: [required],
    }),
    []
  );
  const { onStartRegister, errorMessage } = useAuthStore();
  const {
    errorValues,
    formValues,
    handleBlur,
    handleChange,
    isFormInvalid,
    isFormInvalidSubmit,
    setisSubmited,
  } = useForm(initialValues, config);
  const { email, lastname, name, password, password2, tel } = formValues;
  const loginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisSubmited(true);
    if (isFormInvalidSubmit(formValues)) {
      return;
    }
    onStartRegister({ email, name, password, lastname, tel });
  };
  useEffect(() => {
    if (errorMessage !== undefined) {
      console.log(errorMessage);
    }
  }, [errorMessage]);

  return (
    <AuthLayout title="Registrarse">
      <form onSubmit={loginSubmit}>
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Name"
          value={name}
          onChange={handleChange}
          name="name"
          error={errorValues.name.length > 0}
          helperText={errorValues.name.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Apellido"
          value={lastname}
          onChange={handleChange}
          name="lastname"
          error={errorValues.lastname.length > 0}
          helperText={errorValues.lastname.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Email"
          value={email}
          onChange={handleChange}
          name="email"
          error={errorValues.email.length > 0}
          helperText={errorValues.email.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Teléfono"
          value={tel}
          onChange={handleChange}
          name="tel"
          error={errorValues.tel.length > 0}
          helperText={errorValues.tel.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={handleChange}
          name="password"
          error={errorValues.password.length > 0}
          helperText={errorValues.password.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          type="password"
          label="Confirmar Password"
          value={password2}
          onChange={handleChange}
          name="password2"
          error={errorValues.password2.length > 0}
          helperText={errorValues.password2.join(" - ")}
          onBlur={handleBlur}
        />
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color={isFormInvalid ? "error" : "secondary"}
          fullWidth
          type="submit"
        >
          SIGN UP
        </Button>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" color="secondary.light">
            Ya tienes una cuenta?
          </Typography>
          <Link to={"/auth/login"}>
            <Typography
              variant="subtitle1"
              color="secondary.light"
              sx={{
                ":hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Inicia Sesión
            </Typography>
          </Link>
        </Box>
      </form>
    </AuthLayout>
  );
};
