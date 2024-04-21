import { Pagination } from "../interfaces/global";

export const roles = ["CLIENTE", "EMPLEADO", "GERENTE"];
export const paginationDefault: Pagination = {
  totalDocs: 0,
  limit: 20,
  page: 1,
  totalPages: 0,
};
