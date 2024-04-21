import { RootState } from "../../../../store/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { UsuarioItem } from "../interfaces";
import { setSliceItemActive, setSliceOpenModal } from "../store";
export const useUsuarioStore = () => {
  const { openModal, itemActive, itemDefault } = useSelector(
    (state: RootState) => state.usuario
  );

  const dispatch = useDispatch();

  const setOpenModal = (value: boolean) => {
    dispatch(setSliceOpenModal(value));
  };

  const setItemActive = (item: UsuarioItem) => {
    dispatch(setSliceItemActive(item));
  };

  return {
    //Propiedades
    openModal,
    itemActive,
    itemDefault,
    //Metodos
    setOpenModal,
    setItemActive,
  };
};
