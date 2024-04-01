import { Table } from "@mui/material";
import { StyledTableContainer } from "../style";

export const TablaLayout = ({ children }: { children: JSX.Element[] }) => {
  return (
    <StyledTableContainer
      sx={{ animationDuration: ".5s" }}
      className="animate__animated animate__slideInRight"
    >
      <Table size="small" stickyHeader aria-label="sticky table">
        {children}
      </Table>
    </StyledTableContainer>
  );
};
