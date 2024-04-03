import { Box, TableHead } from "@mui/material";
import { StyledTableHeaderCell, StyledTableRow } from "../style";
import { Column, Sort } from "../../../interfaces/global";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

export const TableHeader = ({
  columns,
  sort,
  sortFunction,
}: {
  columns: Column[];
  sort: Sort;
  sortFunction?: (sort: Sort) => void;
}) => {
  return (
    <TableHead>
      <StyledTableRow>
        {columns.map((column) => (
          <StyledTableHeaderCell
            key={column.label}
            style={{ minWidth: column.minWidth }}
            sorteable={column.sortable ? 1 : 0}
            active={column.campo === sort.campo ? 1 : 0}
            onClick={() => {
              if (!sortFunction) return;
              if (!column.sortable) return;
              sortFunction({
                campo: column.campo || "",
                asc: column.campo === sort.campo ? !sort.asc : true,
              });
            }}
          >
            <Box display={"flex"} alignItems={"center"}>
              {column.label}

              {sort.campo === column.campo &&
                (sort.asc ? (
                  <ArrowDownward fontSize="small" />
                ) : (
                  <ArrowUpward fontSize="small" />
                ))}
            </Box>
          </StyledTableHeaderCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
};
