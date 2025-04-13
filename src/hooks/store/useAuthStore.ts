import { useDispatch, useSelector } from "react-redux";
import {
  LoginParams,
  RegisterParams,
  RootState,
  Usuario,
} from "../../store/interfaces";
import {
  clearErrorMessage,
  onSliceEditUsuario,
  onSliceLogin,
  onSliceLogout,
} from "../../store/auth";
import { clienteAxios } from "../../api";

interface UsuarioWithToken extends Usuario {
  token: string;
}

export const useAuthStore = () => {
  const { status, usuario, errorMessage } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const onStartLogin = async ({ email, password }: LoginParams) => {
    // dispatch(onSlicechecking());
    try {
      const {
        data: { token, ...rest },
      }: { data: UsuarioWithToken } = await clienteAxios.post("/auth", {
        email,
        password,
      });
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", new Date().getTime().toString());
      dispatch(onSliceLogin(rest));
    } catch (error: any) {
      const msgError = error?.response?.data?.msg || "Credenciales incorrectas";
      dispatch(onSliceLogout(msgError));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const onStartRegister = async (arg: RegisterParams) => {
    // dispatch(onSlicechecking());
    try {
      const {
        data: { token, ...rest },
      }: { data: UsuarioWithToken } = await clienteAxios.post("/auth/new", arg);
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", new Date().getTime().toString());
      dispatch(onSliceLogin(rest));
    } catch (error: any) {
      console.log({error});
      
      const msgError = error?.response?.data?.msg || "Error al registrarse";
      dispatch(onSliceLogout(msgError));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const onStartSheckAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onSliceLogout('No hay token'));
    try {
      const {
        data: { token, ...rest },
      }: { data: UsuarioWithToken } = await clienteAxios.get("/auth/renew");
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", new Date().getTime().toString());
      dispatch(onSliceLogin(rest));
    } catch (error: any) {
      console.log({ error });

      const msgError = error?.response?.data?.msg || "Error al loguearse";
      dispatch(onSliceLogout(msgError));
      localStorage.removeItem("token");
      localStorage.removeItem("token-init-data");
    }
  };

  const onStartLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token-init-data");
    dispatch(onSliceLogout());
  };
  const onEditUsuario = (usuario: Usuario) => {
    dispatch(onSliceEditUsuario(usuario));
  };

  return {
    //*Propiedades
    status,
    usuario,
    errorMessage,
    //Metodos
    onStartLogin,
    onStartLogout,
    onStartRegister,
    onStartSheckAuthToken,
    onEditUsuario,
  };
};
