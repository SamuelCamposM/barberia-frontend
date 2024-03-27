import { Table } from "@mui/material";
import { StyledTableContainer } from "../style";

export const TablaLayout = ({ children }: { children: JSX.Element[] }) => {
  return (
    <StyledTableContainer>
      <Table
        size="small"
        stickyHeader
        aria-label="sticky table"
        className="animate__animated animate__fadeIn"
        sx={{ animationDuration: ".5s" }}
      >
        {children}
      </Table>
    </StyledTableContainer>
  );
};
