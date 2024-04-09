import {
  getSliceDataMenu,
  onSliceEditMenu,
  setSliceActiveRow,
  setSliceOpenModalMenu,
} from "../store";
import { getPages } from "../../../Layout/helpers";
import { PageItem } from "../";
import { RootState } from "../../../../store/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { Components, tipoPermiso } from "../../../../interfaces/global";
import { toast } from "react-toastify";
import { useCallback } from "react";
export const useMenuStore = () => {
  const { openModal, rowActive, data, rowDefault } = useSelector(
    (state: RootState) => state.menu
  );
  const {
    user: { rol },
  } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  const getDataMenu = async () => {
    const res = await getPages();
    const { data } = res.data;

    dispatch(getSliceDataMenu(data));
  };

  const setOpenModalMenu = (value: boolean) => {
    dispatch(setSliceOpenModalMenu(value));
  };

  const setActiveRow = (item: PageItem) => {
    dispatch(setSliceActiveRow(item));
  };

  const onEditMenu = (item: PageItem) => {
    dispatch(onSliceEditMenu(item));
  };
  const noTienePermiso = useCallback(
    (component: Components, tipoPermiso: tipoPermiso) => {
      const pageFind = data.find((page) => page.componente === component);
      if (!pageFind) {
        toast.error(`Error al validar permiso`);
        return false;
      }
      const sinPermiso = !pageFind[tipoPermiso].includes(rol);
      if (sinPermiso) {
        toast.error(`No tiene permiso para  ${tipoPermiso}`);
      }
      return sinPermiso;
    },
    [data, rol]
  );

  return {
    //Propiedades
    openModal,
    rowActive,
    data,
    //Metodos
    getDataMenu,
    onEditMenu,
    setOpenModalMenu,
    setActiveRow,
    rowDefault,
    noTienePermiso,
  };
};
