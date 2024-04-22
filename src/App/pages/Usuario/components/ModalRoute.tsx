import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { ModalUsuario } from "./ModalUsuario";
import { UsuarioItem } from "../interfaces";
import { getSubPath } from "../../../../helpers";
import { Backdrop } from "@mui/material";
import { Cargando } from "../../../components";

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

  return cargando ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
    >
      <Cargando titulo="Cargando" />
    </Backdrop>
  ) : (
    <ModalUsuario />
  );
};
