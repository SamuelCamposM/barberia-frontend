import { Action } from "../../../interfaces/global";
import { Badge, Box, IconButton, Tooltip, Button } from "@mui/material";

export const Accion = ({
  action: {
    Icon,
    color,
    name,
    onClick,
    tipo,
    badge = "",
    disabled,
    ocultar,
    size = "medium",
    variant = "contained",
  },
  index,
}: {
  action: Action;
  index: number;
}) => {
  if (ocultar) return null;
  if (tipo === "boton") {
    return (
      <Tooltip title={name} arrow>
        <Badge
          badgeContent={!badge ? null : badge === "index" ? index + 1 : badge}
          color={color}
        >
          <Button
            aria-label={name}
            color={color}
            disabled={disabled}
            onClick={() => {
              if (ocultar) return;
              onClick(null);
            }}
            size={size}
            variant={variant}
          >
            {name}
          </Button>
        </Badge>
      </Tooltip>
    );
  }
  if (tipo === "icono") {
    return (
      <Tooltip title={name} arrow>
        <Badge
          badgeContent={!badge ? null : badge === "index" ? index + 1 : badge}
          color={color}
        >
          <IconButton
            aria-label={name}
            color={color}
            disabled={disabled}
            onClick={() => {
              if (ocultar) return;
              onClick(null);
            }}
            size={size}
          >
            <Icon fontSize={size} />
          </IconButton>
        </Badge>
      </Tooltip>
    );
  }
};

export const Acciones = ({ actions }: { actions: Action[] }) => {
  return (
    <Box display={"flex"} alignItems={"center"} gap={1}>
      {actions.map((action, index) => (
        <Accion action={action} key={action.name} index={index} />
      ))}
    </Box>
  );
};
