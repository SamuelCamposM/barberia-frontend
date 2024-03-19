export interface AuthState {
  status: "checking" | "authenticated" | "not-authenticated";
  user: User;
  errorMessage?: string;
}

export interface User {
  name: string;
  lastname: string;
  tel: string;
  email: string;
  online: boolean;
  estado: boolean;
  rol: "GERENTE" | "EMPLEADO" | "CLIENTE";
  photo?: string;
  uid: string;
}
// FUNCIONES
export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  lastname: string;
  tel: string;
  email: string;
  password: string;
}
