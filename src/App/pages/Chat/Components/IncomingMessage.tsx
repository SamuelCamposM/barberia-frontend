import { Avatar, Box, ListItem, ListItemText } from "@mui/material";
import { formatearFecha } from "../../../../helpers/date/formatearFecha";
import { Mensaje } from "../../../../store/interfaces";

export const IncomingMessage = ({ msg }: { msg: Mensaje }) => {
  return (
    <ListItem disablePadding>
      <Avatar
        src="https://ptetutorials.com/images/usuario-profile.png"
        className="Avatar"
      />
      <Box className="BoxMessage bg_BoxMessage">
        <ListItemText
          className="ListItemText"
          primary={msg.mensaje}
          secondary={formatearFecha(msg.createdAt)}
        />
      </Box>
    </ListItem>
  );
};
