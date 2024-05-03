export interface AuthState {
  errorMessage?: string;
  status: "checking" | "authenticated" | "not-authenticated";
  usuario: Usuario;
}

export type Roles = "GERENTE" | "EMPLEADO" | "CLIENTE";
export interface Usuario {
  email: string;
  estado: boolean;
  lastname: string;
  dui?: string;
  name: string;
  online: boolean;
  photo?: string;
  rol: Roles;
  tel: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
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
