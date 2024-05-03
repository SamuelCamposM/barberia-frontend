import {
  Avatar,
  Badge,
  Box,
  Drawer,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useAuthStore, useChatStore, useUiStore } from "../../../hooks";
import { useNavigate } from "react-router-dom";
export const ChatDrawer = () => {
  const { usuarios, chatActivo } = useChatStore();
  const { usuario: usuarioAuth } = useAuthStore();
  const navigate = useNavigate();
  const { openDrawerChat, onToogleDrawerChat } = useUiStore();

  return (
    <Drawer
      anchor={"right"}
      open={openDrawerChat}
      onClose={onToogleDrawerChat}
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 4,
      })}
      PaperProps={{
        sx: (theme) => ({
          backgroundColor: theme.palette.secondary.dark,
        }),
      }}
    >
      <Box
        sx={{
          width: 250,
        }}
        role="presentation"
        onClick={onToogleDrawerChat}
        onKeyDown={onToogleDrawerChat}
      >
        <List>
          {usuarios
            .filter((usuario) => usuario.uid !== usuarioAuth.uid)
            .map((usuario) => (
              <ListItemButton
                sx={{
                  backgroundColor: (theme) =>
                    usuario.uid === chatActivo
                      ? theme.palette.primary.main
                      : "transparent",
                }}
                key={usuario.uid}
                onClick={() => {
                  navigate(`chat/?uid=${usuario.uid}&name=${usuario.name}`);
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color={usuario.online ? "success" : "error"}
                    variant="dot"
                  >
                    <Avatar src={usuario.photo} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={usuario.name} />
              </ListItemButton>
            ))}
        </List>
      </Box>
    </Drawer>
  );
};
