import { Usuario } from "./auth";

export interface Mensaje {
  _id: string;
  createdAt: string;
  de: string;
  mensaje: string;
  para: string;
  updatedAt: string;
}

export interface ChatState {
  chatActivo: string | null;
  mensajes: Mensaje[];
  uid: string;
  usuarios: Usuario[];
}
