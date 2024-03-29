import {
  getSliceDataDepto,
  onSliceAgregarDepto,
  onSliceEditDepto,
  setSliceAgregando,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/interfaces";
import { getDepto } from "../helpers";
import { Pagination } from "../../../../interfaces/global";
import { toast } from "react-toastify";
import { DeptoItem } from "..";
// import { useNavigate } from "react-router-dom";
export const useDeptoStore = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { data, pagination, isSearching, rowDefault, agregando } = useSelector(
    (state: RootState) => state.depto
  );

  const getDataDepto = async (pagination: Pagination, busqueda: string) => {
    const {
      error,
      result: { docs, ...paginationResult },
    } = await getDepto(pagination, busqueda);

    if (error) {
      return toast.error("Hubo un error al obtener los departamentos");
    }
    dispatch(getSliceDataDepto({ docs, paginationResult }));
    // navigate(`?pagination=${JSON.stringify(pagination)}`);
  };
  const onEditDepto = (item: DeptoItem) => {
    dispatch(onSliceEditDepto(item));
  };
  const onAgregarDepto = (item: DeptoItem) => {
    dispatch(onSliceAgregarDepto(item));
  };
  const setAgregando = (valorAgregando: boolean) => {
    dispatch(setSliceAgregando(valorAgregando));
  };

  return {
    //* METODOS
    getDataDepto,
    onEditDepto,
    setAgregando,
    onAgregarDepto,
    //*VALORES
    agregando,
    data,
    isSearching,
    pagination,
    rowDefault,
  };
};
