import { TextField, Box, Typography } from "@mui/material";
import { useAuthStore, useForm } from "../../hooks";
import Button from "@mui/material/Button";
import { AuthLayout } from "../Layout/AuthLayout";
import { useMemo, useEffect } from "react";
import { required } from "../../helpers";
import { Link } from "react-router-dom";

interface RegisterInterface {
  [key: string]: string | string[] | number;
  email: string;
  password: string;
  // campoTexto: string[];
}

export const LoginPage = () => {
  const initialValues = useMemo<RegisterInterface>(
    () => ({
      email: "",
      password: "",
      // campoTexto: ["1", "2"],
    }),
    []
  );

  const config = useMemo(
    () => ({
      password: [required],
      email: [required],
      // campoTexto: [
      //   required,
      //   (a: string | string[] ) => {
      //     const res =
      //       typeof a === "object" &&
      //       a.some((campo: string) => {
      //         return Number(campo) < 5;
      //       });

      //     if (res) {
      //       return "Los campos tienen tener valor mayor a 5";
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
    // setformValues,
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
      console.log({ errorMessage });
    }
  }, [errorMessage]);

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={loginSubmit}> 
        {errorMessage ? errorMessage : ""}
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
        {/* <Divider sx={{ mt: 2 }}>
          <Typography color={"error"}>
            {errorValues.campoTexto.join(" - ")}
          </Typography>
        </Divider>
        {formValues.campoTexto.map((campo, index) => (
          <TextField
            key={index}
            sx={{ mt: 1 }}
            fullWidth
            type="number"
            label={`Campo ${index + 1}`}
            value={campo}
            error={errorValues.campoTexto.length > 0}
            onBlur={handleBlur}
            onChange={(e) => {
              setformValues((prev) => {
                let newCampos = prev.campoTexto;
                newCampos[index] = e.target.value;
                return { ...prev, campoTexto: newCampos };
              });
            }}
          />
        ))} */}
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
          <Typography variant="subtitle1" color="secondary.light">
            Aun no tienes una cuenta?
          </Typography>
          <Link to="/auth/register">
            <Typography
              variant="subtitle1"
              color="secondary.light"
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
