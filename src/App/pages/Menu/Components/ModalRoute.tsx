import { useNavigate, useParams } from "react-router-dom";
import { ModalMenu, useMenuStore } from "..";
import { useEffect } from "react";
import { usePath } from "../../../hooks";

export const ModalRoute = () => {
  const { itemActive, data, setActiveItem, setOpenModalMenu, itemDefault } =
    useMenuStore();
  const { _id } = useParams();

  const navigate = useNavigate();
  const path = usePath();
  const onBackPage = () => {
    navigate(`/${path}`);
  };
  useEffect(() => {
    if (_id === "nuevo") {
      setActiveItem(itemDefault);
      setOpenModalMenu(true);
    } else {
      if (itemActive._id !== _id) {
        const itemF = data.find((row) => row._id === _id);
        if (itemF) {
          setActiveItem(itemF);
          setOpenModalMenu(true);
        } else {
          onBackPage();
        }
      }
    }
  }, [_id]);

  return <ModalMenu />;
};
