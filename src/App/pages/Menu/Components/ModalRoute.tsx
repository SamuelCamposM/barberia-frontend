import { useNavigate, useParams } from "react-router-dom";
import { ModalMenu, useMenuStore } from "..";
import { useEffect } from "react";

export const ModalRoute = () => {
  const { rowActive, rows, setActiveRow, setOpenModalMenu, rowDefault } =
    useMenuStore();
  const { _id } = useParams();

  const navigate = useNavigate();

  const onBackPage = () => {
    navigate("/menu");
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
