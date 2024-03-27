import { useNavigate, useParams } from "react-router-dom";
import { ModalMenu, useMenuStore } from "..";
import { useEffect } from "react";
import { usePath } from "../../../hooks";

export const ModalRoute = () => {
  const { rowActive, rows, setActiveRow, setOpenModalMenu, rowDefault } =
    useMenuStore();
  const { _id } = useParams();

  const navigate = useNavigate();
  const path = usePath();
  const onBackPage = () => {
    navigate(`/${path}`);
  };
  useEffect(() => {
    if (_id === "nuevo") {
      setActiveRow(rowDefault);
      setOpenModalMenu(true);
    } else {
      if (rowActive._id !== _id) {
        const itemF = rows.find((row) => row._id === _id);
        if (itemF) {
          setActiveRow(itemF);
          setOpenModalMenu(true);
        } else {
          onBackPage();
        }
      }
    }
  }, [_id]);

  return <ModalMenu />;
};
