import {
  getSliceDataDepto,
  onSliceAddOrRemoveMunicipio,
  onSliceAgregarDepto,
  onSliceEditDepto,
  onSliceEliminarDepto,
  setSliceCargando,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/interfaces";
import { getDeptos } from "../helpers";
import {
  Pagination,
  Sort,
  socketChildListener,
} from "../../../../interfaces/global";
import { DeptoItem } from "..";
import { paginationDefault } from "../../../../helpers";
// import { useNavigate } from "react-router-dom";
export const useDeptoStore = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { data, cargando, pagination } = useSelector(
    (state: RootState) => state.depto
  );

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
      return { paginationResult: paginationDefault, error: true };
    }

    dispatch(getSliceDataDepto({ docs, paginationResult }));
    return { paginationResult, error: false };
    // navigate(`?pagination=${JSON.stringify(pagination)}`);
  };
  const onEditDepto = (item: DeptoItem) => {
    dispatch(onSliceEditDepto(item));
  };
  const onAgregarDepto = (item: DeptoItem) => {
    dispatch(onSliceAgregarDepto(item));
  };
  // const setAgregando = (valorAgregando: boolean) => {
  // dispatch(setSliceAgregando(valorAgregando));
  // };

  const onEliminarDepto = (_id: string) => {
    dispatch(onSliceEliminarDepto(_id));
  };
  const onAddOrRemoveMunicipio = (data: {
    _id: string;
    tipo: socketChildListener;
  }) => {
    dispatch(onSliceAddOrRemoveMunicipio(data));
  };

  return {
    //* METODOS
    getDataDepto,
    onEditDepto,
    // setAgregando,
    onAgregarDepto,
    onEliminarDepto,
    onAddOrRemoveMunicipio,
    //*VALORES
    data,
    cargando,
    pagination,
  };
};
