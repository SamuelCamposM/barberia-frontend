import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useAuthStore, useForm, useLocalStorage } from "../../hooks";
import Button from "@mui/material/Button";
import { AuthLayout } from "../Layout/AuthLayout";
import { useMemo, useEffect } from "react";
import { required } from "../../helpers";
import { Link } from "react-router-dom";
import { DataAlerta } from "../../App/components";
import { toast } from "react-toastify";
import { LoginParams } from "../../store/interfaces";

const keyFormStorage = "formValues";
export const LoginPage = () => {
  const [storedValues, setStoredValues] = useLocalStorage<LoginParams>(keyFormStorage, {
    email: "",
    password: "",
  });
  const [rememberPassword, setRememberPassword] = useLocalStorage(
    "rememberPassword",
    true
  );
  const config = useMemo(
    () => ({
      email: [required],
      password: [required],
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
    // setformValues,
  } = useForm(storedValues, config);
  const { onStartLogin, errorMessage } = useAuthStore();
  const loginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisSubmited(true);
    handleBlur();
    if (isFormInvalidSubmit(formValues)) {
      return;
    }

    if (rememberPassword) {
      setStoredValues(formValues);
    } else {
      localStorage.removeItem(keyFormStorage);
    }

    onStartLogin(formValues);
  };
  useEffect(() => {
    if (errorMessage !== undefined) {
      toast.error(<DataAlerta titulo={errorMessage} subtitulo="" enlace="" />, {
        position: "top-center",
      });
    }
  }, [errorMessage]);

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={loginSubmit}>
        {/* <h2> {isFormInvalid ? "Invalido" : "valido"}</h2> */}
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
          color={isFormInvalid ? "error" : "primary"}
          fullWidth
          type="submit"
        >
          SING IN
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              name="rememberPassword"
              color="secondary"
            />
          }
          label="Recordar Credenciales"
        />
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
