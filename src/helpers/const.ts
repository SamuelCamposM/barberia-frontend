import { Pagination } from "../interfaces/global";

export const roles = ["GERENTE", "EMPLEADO", "CLIENTE"];
export const paginationDefault: Pagination = {
  totalDocs: 0,
  limit: 10,
  page: 1,
  totalPages: 0,
};
