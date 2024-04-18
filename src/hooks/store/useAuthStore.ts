import { useDispatch, useSelector } from "react-redux";
import { clienteAxios } from "../../api";
import {
  clearErrorMessage,
  onSliceEditUsuario,
  onSliceLogin,
  onSliceLogout,
  // onSlicechecking,
} from "../../store/auth";
import {
  LoginParams,
  RegisterParams,
  RootState,
  Usuario,
} from "../../store/interfaces";
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
        data: { token, ...usuarioSinToken },
      }: { data: UsuarioWithToken } = await clienteAxios.post("/auth", {
        email,
        password,
      });
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", String(new Date().getTime()));
      dispatch(onSliceLogin(usuarioSinToken));
    } catch (error) {
      dispatch(onSliceLogout("Credenciales incorrectas"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 2000);
    }
  };

  const onStartRegister = async ({
    name,
    email,
    password,
    lastname,
    tel,
  }: RegisterParams) => {
    // dispatch(onSlicechecking());
    try {
      const {
        data: { token, ...usuarioSinToken },
      }: { data: UsuarioWithToken } = await clienteAxios.post("/auth/new", {
        name,
        email,
        password,
        lastname,
        tel,
      });
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", String(new Date().getTime()));
      dispatch(onSliceLogin(usuarioSinToken));
    } catch (error: any) {
      dispatch(onSliceLogout(error.response?.data?.msg));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 2000);
    }
  };

  const onStartSheckAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onSliceLogout(undefined));
    try {
      const {
        data: { token, ...usuarioSinToken },
      } = await clienteAxios.get("/auth/renew");
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", String(new Date().getTime()));

      dispatch(onSliceLogin(usuarioSinToken));
    } catch (error: any) {
      localStorage.clear();
      dispatch(onSliceLogout(error?.response?.data?.msg || "Sesión expirada"));
    }
  };

  const onStartLogout = () => {
    localStorage.clear();
    dispatch(onSliceLogout(undefined));
  };
  const onEditUsuario = (usuario: Usuario) => {
    dispatch(onSliceEditUsuario(usuario));
  };

  return {
    //Propiedades
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
