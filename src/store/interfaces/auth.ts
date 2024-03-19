export interface AuthState {
  status: "checking" | "authenticated" | "not-authenticated";
  user: User;
  errorMessage?: string;
}

export interface User {
  name: string;
  email: string;
  online: boolean;
  uid: string;
  roles: string;
}
// FUNCIONES
export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}
