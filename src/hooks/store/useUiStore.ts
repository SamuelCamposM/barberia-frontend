import { useDispatch, useSelector } from "react-redux";
import {
  onSliceToogleDrawerChat,
  onSliceToogleSidebar,
  onSliceToogleSidebarMobile,
  setSliceOpenProfileModal,
} from "../../store/ui";
import { RootState } from "../../store/interfaces";

export const useUiStore = () => {
  const {
    openDrawerChat,
    openDrawerSidebar,
    openDrawerSidebarMobile,
    openModalProfile,
  } = useSelector((state: RootState) => state.ui);

  const dispatch = useDispatch();

  const onToogleDrawerChat = () => {
    dispatch(onSliceToogleDrawerChat());
  };

  const onToogleSidebar = () => {
    dispatch(onSliceToogleSidebar());
  };
  const onToogleSidebarMobile = () => {
    dispatch(onSliceToogleSidebarMobile());
  };
  const setOpenProfileModal = (openValue: boolean) => {
    dispatch(setSliceOpenProfileModal(openValue));
  };

  return {
    //Propiedades
    openDrawerChat,
    openDrawerSidebar,
    openDrawerSidebarMobile,
    openModalProfile,
    //Metodos
    onToogleDrawerChat,
    onToogleSidebar,
    onToogleSidebarMobile,
    setOpenProfileModal,
  };
};
