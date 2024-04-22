import { RootState } from "../../../../store/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { UsuarioItem } from "../interfaces";
import { setSliceItemActive, setSliceOpenModal } from "../store";
import { useThemeSwal } from "../../../hooks";
import Swal from "sweetalert2";
export const useUsuarioStore = () => {
  const { openModal, itemActive, itemDefault } = useSelector(
    (state: RootState) => state.usuario
  );

  const themeSwal = useThemeSwal();
  const dispatch = useDispatch();

  const setOpenModal = (value: boolean) => {
    dispatch(setSliceOpenModal(value));
  };
  const setItemActive = async (
    itemToActive: UsuarioItem,
    sinValidar?: boolean
  ) => {
    dispatch(setSliceItemActive(itemToActive));
    return false;
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
