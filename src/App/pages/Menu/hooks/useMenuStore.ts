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
export const useMenuStore = () => {
  const { openModal, rowActive, rows, rowDefault } = useSelector(
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
  const noTienePermiso = (component: Components, tipoPermiso: tipoPermiso) => {
    const pageFind = rows.find((page) => page.componente === component);
    if (!pageFind) {
      toast.error(`Error al validar permiso`);
      return false;
    }
    const sinPermiso = !pageFind[tipoPermiso].includes(rol);
    if (sinPermiso) {
      toast.error(`No tiene permiso para  ${tipoPermiso}`);
    }
    return sinPermiso;
  };
  return {
    //Propiedades
    openModal,
    rowActive,
    rows,
    //Metodos
    getDataMenu,
    onEditMenu,
    setOpenModalMenu,
    setActiveRow,
    rowDefault,
    noTienePermiso,
  };
};
