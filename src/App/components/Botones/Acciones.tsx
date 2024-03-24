import { agregarTransparencia } from "../../../helpers";
import { Action } from "../../../interfaces/global";
import { Badge, Box, IconButton, Tooltip } from "@mui/material";

interface AccionesProps {
  actionsLeft: Action[];
  actionsRight: Action[];
}

export const Accion = ({
  action: { Icon, onClick, disabled, name, ocultar, bgColor },
  index,
}: {
  action: Action;
  index: number;
}) => {
  if (ocultar) return null;
  return (
    <Tooltip title={name} placement="top" followCursor arrow>
      <Badge badgeContent={index + 1} color={bgColor}>
        <IconButton
          disabled={disabled}
          sx={{
            background: bgColor
              ? (theme) =>
                  agregarTransparencia(theme.palette[bgColor].dark, 0.5)
              : "",
            mx: 1,
          }}
          aria-label={name}
          onClick={onClick}
        >
          <Icon />
        </IconButton>
      </Badge>
    </Tooltip>
  );
};

export const Acciones = ({ actionsLeft, actionsRight }: AccionesProps) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      sx={{ borderTop: (theme) => `1px solid ${theme.palette.secondary.dark}` }}
    >
      <Box display={"flex"} gap={1}>
        {actionsLeft.map((action, index) => (
          <Accion action={action} key={action.name} index={index} />
        ))}
      </Box>
      <Box>
        {actionsRight.map((action, index) => (
          <Accion action={action} key={action.name} index={index} />
        ))}
      </Box>
    </Box>
  );
};
