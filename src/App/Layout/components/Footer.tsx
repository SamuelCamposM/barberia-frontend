import { Box, Toolbar, Typography, IconButton, Badge } from "@mui/material";
import { Chat, OnlinePrediction } from "@mui/icons-material";
import { useAuthStore, useUiStore, useProvideSocket } from "../../../hooks";
import { AppBarFooter } from "./styled";

export const Footer = () => {
  const { online } = useProvideSocket();
  const { onToogleDrawerChat } = useUiStore();
  const { usuario } = useAuthStore();
  return (
    <AppBarFooter position="sticky">
      <Toolbar className="toolbar">
        <Box className="boxChat">
          <IconButton
            className="botonChat"
            aria-label="Chat boton"
            onClick={onToogleDrawerChat}
          >
            <Badge badgeContent={1} color="error">
              <Chat />
            </Badge>
          </IconButton>
        </Box>
        <Box className="boxOnline">
          <Typography variant="h6" className="Typography">
            {usuario.name}
          </Typography>
          <OnlinePrediction color={online ? "success" : "error"} />
        </Box>
      </Toolbar>
    </AppBarFooter>
  );
};
