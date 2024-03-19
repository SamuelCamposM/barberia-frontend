import { Box, ListItem, ListItemText } from "@mui/material";
import { formatearFecha } from "../../../../helpers/date/formatearFecha";
import { Mensaje } from "../../../../store/interfaces";

export const OutgoingMessage = ({ msg }: { msg: Mensaje }) => {
  return (
    <ListItem disablePadding className="ListItem">
      <Box className="BoxMessage bg_BoxMessage2">
        <ListItemText
          className="ListItemText"
          primary={msg.mensaje}
          secondary={formatearFecha(msg.createdAt)}
        />
      </Box>
    </ListItem>
  );
};
