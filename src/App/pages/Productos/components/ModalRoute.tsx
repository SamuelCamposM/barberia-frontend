import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useProductoStore } from "../hooks/useProductoStore";
import { ModalProducto } from "./ModalProducto";
import { ProductoItem } from "../interfaces";
import { getSubPath, isThereNextPath } from "../../../../helpers";

export const ModalRoute = ({
  productosData,
  cargando,
  prevPath,
}: {
  productosData: ProductoItem[];
  cargando: boolean;
  prevPath: string;
}) => {
  const { setOpenModal, setItemActive, itemDefault, itemActive } =
    useProductoStore();
  const { _id } = useParams<{ _id: string }>();

  const navigate = useNavigate();

  const onBackPage = () => {
    navigate(getSubPath());

    setOpenModal(false);
  };
  useEffect(() => {
    if (cargando) return;
    if (_id === "nuevo") {
    } else {
      let itemFind = productosData.find((productoI) => productoI._id === _id);

      if (itemFind) {
        if (itemActive._id !== itemFind._id) {
          setItemActive(itemFind);
        }
      } else {
        if (itemActive._id) {
          setItemActive(itemActive, true);
        } else {
          onBackPage();
          setItemActive(itemDefault, true);
        }
      }
    }
    return () => {
      if (!isThereNextPath(prevPath)) {
        setItemActive(itemDefault, true);
      }
    };
  }, [_id, cargando]);

  return <ModalProducto />;
};
