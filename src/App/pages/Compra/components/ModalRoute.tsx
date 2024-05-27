import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useCompraStore } from "../hooks/useCompraStore";
import { ModalCompra } from "./ModalCompra";
import { CompraItem } from "../interfaces";
import { getSubPath} from "../../../../helpers";

export const ModalRoute = ({
  comprasData,
  cargando,
  
}: {
  comprasData: CompraItem[];
  cargando: boolean;
  
}) => {
  const { setOpenModal, setItemActive, itemDefault, itemActive } =
    useCompraStore();
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
      let itemFind = comprasData.find((compraI) => compraI._id === _id);

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
      // return () => {
    //   if (!isThereNextPath(prevPath)) {
    //     setItemActive(itemDefault, true);
    //   }
    // };
  }, [_id, cargando]);

  return <ModalCompra />;
};
