import { ChangeEvent } from "react";
import { Pagination, Sort } from "../../interfaces/global";
import Swal from "sweetalert2";
import { useThemeSwal } from "./useThemeSwal";

export const useHandleNavigation = <
  Item extends { _id?: string | undefined },
  T = ""
>({
  handleEvent,
  pagination,
  itemActive,
  setItemActive,
  itemDefault,
  alertConfig,
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
  itemActive: Item;
  setItemActive: (arg: Item) => void;
  itemDefault: Item;
  alertConfig: {
    title: string;
    text: string;
    confirmButtonText: string;
  };
}) => {
  const themeSwal = useThemeSwal();
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

  const handleChangeEstado = (_: React.SyntheticEvent, newValue: T) => {
    if (!itemActive._id) {
      return handleEvent({ newEstadoRequest: newValue });
    }
    if (itemActive._id) {
      Swal.fire({
        title: alertConfig.title,
        text: alertConfig.text,
        icon: "warning",
        confirmButtonText: alertConfig.confirmButtonText,
        ...themeSwal,
      }).then((result) => {
        if (result.isConfirmed) {
          setItemActive(itemDefault);
          handleEvent({ newEstadoRequest: newValue });
        }
      });
    }
  };

  return {
    handleChangePage,
    handleChangeRowsPerPage,
    sortFunction,
    handleChangeEstado,
  };
};
