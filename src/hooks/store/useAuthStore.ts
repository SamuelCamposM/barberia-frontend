import { useDispatch, useSelector } from "react-redux";
import { chatApi } from "../../api";
import {
  clearErrorMessage,
  onSliceLogin,
  onSliceLogout,
  // onSlicechecking,
} from "../../store/auth";
import {
  LoginParams,
  RegisterParams,
  RootState,
  User,
} from "../../store/interfaces";
interface UserWithToken extends User {
  token: string;
}
export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const onStartLogin = async ({ email, password }: LoginParams) => {
    // dispatch(onSlicechecking());
    try {
      const {
        data: { token, ...usuarioSinToken },
      }: { data: UserWithToken } = await chatApi.post("/auth", {
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
      }: { data: UserWithToken } = await chatApi.post("/auth/new", {
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
      } = await chatApi.get("/auth/renew");
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", String(new Date().getTime()));

      dispatch(onSliceLogin(usuarioSinToken));
    } catch (error) {
      localStorage.clear();
      dispatch(onSliceLogout(undefined));
    }
  };

  const onStartLogout = () => {
    localStorage.clear();
    dispatch(onSliceLogout(undefined));
  };

  return {
    //Propiedades
    status,
    user,
    errorMessage,
    //Metodos
    onStartLogin,
    onStartLogout,
    onStartRegister,
    onStartSheckAuthToken,
  };
};
