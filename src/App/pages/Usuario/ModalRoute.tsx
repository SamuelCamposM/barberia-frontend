import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getSubPath } from "../../../helpers";
import { itemDefault } from "./helpers";
import { UsuarioItem } from "./interfaces";

export const ModalRoute = ({
  setItemActive,
  openModal,
  setOpenModal,
  activeItem,
}: {
  setItemActive: React.Dispatch<React.SetStateAction<UsuarioItem>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeItem: UsuarioItem;
}) => {
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
      if (activeItem._id !== _id) {
        // const itemF = data.find((row) => row._id === _id);
        // if (itemF) {
        //   setItemActive(itemF);
        //   setOpenModalMenu(true);
        // } else {    onBackPage();
        // }
        onBackPage();
      }
    }
  }, [_id]);

  return <>asda </>;
};
