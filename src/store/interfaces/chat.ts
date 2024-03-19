import { User } from "./auth";

export interface Mensaje {
  _id: string;
  de: string;
  para: string;
  mensaje: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  uid: string;
  chatActivo: string | null;
  usuarios: User[];
  mensajes: Mensaje[];
}
