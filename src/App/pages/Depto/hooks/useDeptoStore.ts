import {
  getSliceDataDepto,
  onSliceAddOrRemoveMunicipio,
  onSliceAgregarDepto,
  onSliceEditDepto,
  onSliceEliminarDepto,
  setSliceAgregando,
  setSliceCargando,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/interfaces";
import { getDeptos } from "../helpers";
import { Pagination, Sort } from "../../../../interfaces/global";
import { toast } from "react-toastify";
import { DeptoItem } from "..";
// import { useNavigate } from "react-router-dom";
export const useDeptoStore = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const {
    data,
    pagination,
    isSearching,
    rowDefault,
    agregando,
    cargando,
    sort,
  } = useSelector((state: RootState) => state.depto);

  const getDataDepto = async ({
    pagination,
    sort,
    busqueda,
  }: {
    pagination: Pagination;
    sort: Sort;
    busqueda: string;
  }) => {
    dispatch(setSliceCargando(true));
    const {
      error,
      result: { docs, ...paginationResult },
    } = await getDeptos({ pagination, sort, busqueda });

    if (error) {
      return toast.error("Hubo un error al obtener los departamentos");
    }
    dispatch(getSliceDataDepto({ docs, paginationResult, sort }));
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

  const onEliminarDepto = (_id: string) => {
    dispatch(onSliceEliminarDepto(_id));
  };
  const onAddOrRemoveMunicipio = (data: {
    _id: string;
    tipo: "add" | "remove";
  }) => {
    dispatch(onSliceAddOrRemoveMunicipio(data));
  };

  return {
    //* METODOS
    getDataDepto,
    onEditDepto,
    setAgregando,
    onAgregarDepto,
    onEliminarDepto,
    onAddOrRemoveMunicipio,
    //*VALORES
    agregando,
    data,
    isSearching,
    pagination,
    rowDefault,
    cargando,
    sort,
  };
};
