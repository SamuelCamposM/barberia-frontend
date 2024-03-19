import { useDispatch, useSelector } from "react-redux";
import {
  getSliceDataMenu,
  onCloseSliceModalMenu,
  onOpenSliceModalMenu,
} from "../../store/menu";
import { RootState } from "../../store/interfaces";
import { getPages } from "../../App/Layout/helpers";

export const useMenuStore = () => {
  const { openModal, rowActive, rows } = useSelector(
    (state: RootState) => state.menu
  );

  const dispatch = useDispatch();

  const getDataMenu = async () => {
    const res = await getPages();
    const { data } = res.data;
    console.log({ res });

    dispatch(getSliceDataMenu(data));
  };

  const onCloseModalMenu = () => {
    dispatch(onCloseSliceModalMenu());
  };
  const onOpenModalMenu = () => {
    dispatch(onOpenSliceModalMenu());
  };
  const onToggleOpenMenu = () => {
    if (openModal) {
      dispatch(onCloseSliceModalMenu());
    } else {
      dispatch(onOpenSliceModalMenu());
    }
  };
  return {
    //Propiedades
    openModal,
    rowActive,
    rows,
    //Metodos
    getDataMenu,
    onCloseModalMenu,
    onOpenModalMenu,
    onToggleOpenMenu,
  };
};
