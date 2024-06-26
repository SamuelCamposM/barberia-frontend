import { Pagination } from "../interfaces/global";
import { Roles } from "../store/interfaces";

export const roles: Roles[] = ["CLIENTE", "EMPLEADO", "GERENTE"];
export const rowsPerPageOptions = [10, 20, 50, 100];
export const paginationDefault: Pagination = {
  totalDocs: 0,
  limit: 10,
  page: 1,
};
