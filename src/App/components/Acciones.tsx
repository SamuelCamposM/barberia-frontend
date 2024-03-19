import { Add, Search } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";

interface Action {
  icon: JSX.Element;
  name: string;
  onClick: (arg: any) => void;
}

interface AccionesProps {
  actions: Action[];
}
export const Acciones = ({ actions }: AccionesProps) => {
  return (
    <Box display={"flex"} justifyContent={"space-between"}>
      <Box>
        {actions.map((action) => (
          <Tooltip
            key={action.name}
            title={action.name}
            placement="top"
            followCursor
            arrow
          >
            <IconButton
              sx={(theme) => ({
                background: theme.palette.primary.dark,
                mx: 1,
              })}
              aria-label={action.name}
              onClick={action.onClick}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
      <Box>
        <Tooltip title={"Agregar"} placement="top" followCursor arrow>
          <IconButton
            color="secondary"
            sx={(theme) => ({
              background: theme.palette.primary.dark,
              mx: 1,
            })}
            aria-label={"Agregar"}
            onClick={() => {}}
          >
            <Add />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Agregar"} placement="top" followCursor arrow>
          <IconButton
            color="secondary"
            sx={(theme) => ({
              background: theme.palette.primary.dark,
              mx: 1,
            })}
            aria-label={"Agregar"}
            onClick={() => {}}
          >
            <Search />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
