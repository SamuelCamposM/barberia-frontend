import { useDispatch, useSelector } from "react-redux";
import {
  getSliceDataMenu,
  onCloseSliceModalMenu,
  onOpenSliceModalMenu,
  onSliceEditMenu,
  setSliceActiveRow,
} from "../../store/menu";
import { PageItem, RootState } from "../../store/interfaces";
import { getPages } from "../../App/Layout/helpers";

export const useMenuStore = () => {
  const { openModal, rowActive, rows } = useSelector(
    (state: RootState) => state.menu
  );

  const dispatch = useDispatch();

  const getDataMenu = async () => {
    const res = await getPages();
    const { data } = res.data;

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

  const setActiveRow = (item: PageItem) => {
    dispatch(setSliceActiveRow(item));
  };

  const onEditMenu = (item: PageItem) => {
    dispatch(onSliceEditMenu(item));
  };
  return {
    //Propiedades
    openModal,
    rowActive,
    rows,
    //Metodos
    getDataMenu,
    onCloseModalMenu,
    onEditMenu,
    onOpenModalMenu,
    onToggleOpenMenu,
    setActiveRow,
  };
};
