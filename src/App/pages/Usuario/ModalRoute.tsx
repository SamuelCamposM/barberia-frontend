import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getSubPath } from "../../../helpers";
import { rowDefault } from "./helpers";
import { UsuarioItem } from "./interfaces";

export const ModalRoute = ({
  setActiveItem,
  openModal,
  setOpenModal,
  activeRow,
}: {
  setActiveItem: React.Dispatch<React.SetStateAction<UsuarioItem>>;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeRow: UsuarioItem;
}) => {
  const { _id } = useParams();

  const navigate = useNavigate();

  const onBackPage = () => {
    navigate(getSubPath(location.pathname));
  };
  useEffect(() => {
    if (_id === "nuevo") {
      setActiveItem(rowDefault);
      setOpenModal(true);
    } else {
      if (activeRow._id !== _id) {
        // const itemF = data.find((row) => row._id === _id);
        // if (itemF) {
        //   setActiveRow(itemF);
        //   setOpenModalMenu(true);
        // } else {    onBackPage();
        // }
        onBackPage();
      }
    }
  }, [_id]);

  return <>asda </>;
};
