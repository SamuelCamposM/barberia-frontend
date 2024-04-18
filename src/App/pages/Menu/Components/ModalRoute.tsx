import { useNavigate, useParams } from "react-router-dom";
import { ModalMenu, useMenuStore } from "..";
import { useEffect } from "react";
import { usePath } from "../../../hooks";

export const ModalRoute = () => {
  const { itemActive, data, setItemActive, setOpenModalMenu, itemDefault } =
    useMenuStore();
  const { _id } = useParams();

  const navigate = useNavigate();
  const path = usePath();
  const onBackPage = () => {
    navigate(`/${path}`);
  };
  useEffect(() => {
    if (_id === "nuevo") {
      setItemActive(itemDefault);
      setOpenModalMenu(true);
    } else {
      if (itemActive._id !== _id) {
        const itemF = data.find((row) => row._id === _id);
        if (itemF) {
          setItemActive(itemF);
          setOpenModalMenu(true);
        } else {
          onBackPage();
        }
      }
    }
  }, [_id]);

  return <ModalMenu />;
};
