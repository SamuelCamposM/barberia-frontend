import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { ModalUsuario } from "./ModalUsuario";
import { UsuarioItem } from "../interfaces";
import { getSubPath } from "../../../../helpers";

export const ModalRoute = ({
  usuariosData,
  cargando,
}: {
  usuariosData: UsuarioItem[];
  cargando: boolean;
}) => {
  const { setOpenModal } = useUsuarioStore();
  const { _id } = useParams();

  const navigate = useNavigate();

  const onBackPage = () => {
    navigate(getSubPath(), {
      replace: true,
    });

    setOpenModal(false);
  };
  useEffect(() => {
    if (cargando) return;
    if (_id === "nuevo") {
    } else {
      const itemFind = usuariosData.find((usuarioI) => usuarioI._id === _id);
      if (itemFind) {
      } else onBackPage();
    }
  }, [_id, cargando]);

  return <ModalUsuario />;
};
