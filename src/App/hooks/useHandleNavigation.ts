import { ChangeEvent } from "react";
import { Pagination, Sort } from "../../interfaces/global";
export const useHandleNavigation = <
  Item extends { _id?: string | undefined },
  T = ""
>({
  handleEvent,
  pagination,
  setItemActive,
  itemDefault,
}: {
  handleEvent: ({
    newPagination,
    newSort,
    newEstadoRequest,
  }: {
    newPagination?: Pagination;
    newSort?: Sort;
    newEstadoRequest?: T;
  }) => void;
  pagination: Pagination;
  setItemActive: (arg: Item) => Promise<boolean>;
  itemDefault: Item;
}) => {
  // Manejadores de eventos
  const handleChangePage = (_: unknown, newPage: number) => {
    handleEvent({ newPagination: { ...pagination, page: newPage + 1 } });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    handleEvent({
      newPagination: { ...pagination, page: 1, limit: +event.target.value },
    });
  };

  const sortFunction = (newSort: Sort) => {
    handleEvent({ newSort: newSort });
  };

  const handleChangeEstado = async (_: React.SyntheticEvent, newValue: T) => {
    const res = await setItemActive(itemDefault);
    console.log(res);

    if (res) {
      handleEvent({ newEstadoRequest: newValue });
    }
  };

  return {
    handleChangePage,
    handleChangeRowsPerPage,
    sortFunction,
    handleChangeEstado,
  };
};
