import { Badge, Box, IconButton, Tooltip } from "@mui/material";
import { Action } from "../../../interfaces/global";

interface AccionesProps {
  actionsLeft: Action[];
  actionsRight: Action[];
}

export const Accion = ({
  action: { icon, onClick, disabled, name, ocultar, bgColor, badge },
}: {
  action: Action;
}) => {
  if (ocultar) return null;
  return (
    <Badge content={badge} color="primary">
      <Tooltip title={name} placement="top" followCursor arrow>
        <IconButton
          disabled={disabled}
          sx={{
            background: bgColor ? (theme) => theme.palette[bgColor].dark : "",
            mx: 1,
          }}
          aria-label={name}
          onClick={onClick}
        >
          {icon}
        </IconButton>
      </Tooltip>
    </Badge>
  );
};

export const Acciones = ({ actionsLeft, actionsRight }: AccionesProps) => {
  return (
    <Box display={"flex"} justifyContent={"space-between"}>
      <Box>
        {actionsLeft.map((action) => (
          <Accion action={action} key={action.name} />
        ))}
      </Box>
      <Box>
        {actionsRight.map((action) => (
          <Accion action={action} key={action.name} />
        ))}
      </Box>
    </Box>
  );
};
