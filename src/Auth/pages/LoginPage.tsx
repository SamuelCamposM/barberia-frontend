import { TextField, Box, Typography } from "@mui/material";
import { useAuthStore, useForm } from "../../hooks";
import Button from "@mui/material/Button";
import { AuthLayout } from "../Layout/AuthLayout";
import { useMemo, useEffect } from "react";
import { required } from "../../helpers";
import { Link } from "react-router-dom";

interface RegisterInterface {
  [key: string]: string | string[];
  email: string;
  password: string; 
}

export const LoginPage = () => {
  const initialValues = useMemo<RegisterInterface>(
    () => ({
      email: "",
      password: "",
    }),
    []
  );

  const config = useMemo(
    () => ({
      password: [required],
      email: [required],
      // campoTexto: [
      //   (value: any) => {
      //     console.log({ value });
      //     if (value.length < 5) {
      //       return "El valor tiene que ser minimo de 5 caracteres";
      //     }
      //     return "";
      //   },
      //   (value: any) => {
      //     console.log({ value });
      //     if (value.length < 6) {
      //       return "El valor tiene que ser minimo de 6 caracteres";
      //     }
      //     return "";
      //   },
      // ],
    }),
    []
  );
  const { onStartLogin, errorMessage } = useAuthStore();
  const {
    formValues,
    errorValues,
    handleChange,
    setisSubmited,
    isFormInvalid,
    handleBlur,
    isFormInvalidSubmit,
  } = useForm(initialValues, config);
  const loginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisSubmited(true);
    handleBlur();
    if (isFormInvalidSubmit(formValues)) {
      return;
    }

    onStartLogin({ email: formValues.email, password: formValues.password });
  };
  useEffect(() => {
    if (errorMessage !== undefined) {
      console.log(errorMessage);
    }
  }, [errorMessage]);

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={loginSubmit}>
        <h2> {isFormInvalid ? "Invalido" : "valido"}</h2>
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Email"
          value={formValues.email}
          onChange={handleChange}
          name="email"
          error={errorValues.email.length > 0}
          helperText={errorValues.email.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          type="password"
          label="Password"
          value={formValues.password}
          onChange={handleChange}
          name="password"
          error={errorValues.password.length > 0}
          helperText={errorValues.password.join(" - ")}
          onBlur={handleBlur}
        />

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color={isFormInvalid ? "error" : "secondary"}
          fullWidth
          type="submit"
        >
          SING IN
        </Button>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" color="primary.light">
            Aun no tienes una cuenta?
          </Typography>
          <Link to="/auth/register">
            <Typography
              variant="subtitle1"
              color="primary.light"
              sx={{
                ":hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Registrarse
            </Typography>
          </Link>
        </Box>
      </form>
    </AuthLayout>
  );
};
