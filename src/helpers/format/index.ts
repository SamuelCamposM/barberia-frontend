import { UsuarioForeign } from "../../App/pages/Usuario";
import { Usuario } from "../../store/interfaces";

export const formatUsuarioForeign: (usuario?: Usuario) => UsuarioForeign = (
  usuario?: Usuario
) => {
  return usuario
    ? {
        _id: usuario.uid,
        dui: usuario.dui || "",
        name: usuario.name,
        lastname: usuario.lastname,
      }
    : {
        _id: "",
        dui: "",
        name: "",
        lastname: "",
      };
};
