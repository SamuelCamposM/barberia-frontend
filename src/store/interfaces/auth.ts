export interface AuthState {
  errorMessage?: string;
  status: "checking" | "authenticated" | "not-authenticated";
  user: User;
}

export interface User {
  email: string;
  estado: boolean;
  lastname: string;
  name: string;
  online: boolean;
  photo?: string;
  rol: "GERENTE" | "EMPLEADO" | "CLIENTE";
  tel: string;
  uid: string;
}
// FUNCIONES
export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  lastname: string;
  name: string;
  password: string;
  tel: string;
}
