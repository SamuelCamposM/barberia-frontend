import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getSubPath } from "../../../../helpers";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { ModalUsuario } from "./ModalUsuario";

export const ModalRoute = () => {
  const { itemActive, itemDefault, setItemActive, setOpenModal } =
    useUsuarioStore();
  const { _id } = useParams();

  const navigate = useNavigate();

  const onBackPage = () => {
    navigate(getSubPath(location.pathname));
  };
  useEffect(() => {
    if (_id === "nuevo") {
      setItemActive(itemDefault);
      setOpenModal(true);
    } else {
      if (itemActive._id !== _id) {
    
        if (itemActive) {
          setItemActive(itemActive);
          setOpenModal(true);
        } else {
          onBackPage();
        }
        onBackPage();
      }
    }
  }, [_id]);

  return <ModalUsuario />;
};
