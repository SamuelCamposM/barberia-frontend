import {
  getSliceDataMenu,
  onSliceEditMenu,
  setSliceItemActive,
  setSliceOpenModalMenu,
} from "../store";
import { getPages } from "../../../Layout/helpers";
import { PageItem } from "../";
import { RootState } from "../../../../store/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { Components, tipoPermiso } from "../../../../interfaces/global";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { ConvertirIcono, convertirPath } from "../../../../helpers";
export const useMenuStore = () => {
  const { openModal, itemActive, data, itemDefault } = useSelector(
    (state: RootState) => state.menu
  );
  const {
    usuario: { rol },
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

  const setItemActive = (item: PageItem) => {
    dispatch(setSliceItemActive(item));
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
  const getPathPage: (component: Components) => {
    path: string;
    Icono: JSX.Element;
  } = (component: Components) => {
    const res = data.find((itemMenu) => itemMenu.componente === component);
    return {
      path: convertirPath(res?.componente || ""),
      Icono: ConvertirIcono(res?.icono),
    };
  };

  return {
    //Propiedades
    openModal,
    itemActive,
    data,
    //Metodos
    getDataMenu,
    onEditMenu,
    setOpenModalMenu,
    setItemActive,
    itemDefault,
    noTienePermiso,
    getPathPage,
  };
};
