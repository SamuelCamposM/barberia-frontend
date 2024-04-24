import { Pagination } from "../interfaces/global";

export const roles = ["CLIENTE", "EMPLEADO", "GERENTE"];
export const rowsPerPageOptions = [10, 20, 50, 100];
export const paginationDefault: Pagination = {
  totalDocs: 0,
  limit: 10,
  page: 1,
  totalPages: 0,
};
