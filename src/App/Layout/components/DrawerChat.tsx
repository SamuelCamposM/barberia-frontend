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
  const { user } = useAuthStore();
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
            .filter((usuario) => usuario.uid !== user.uid)
            .map((user) => (
              <ListItemButton
                sx={{
                  backgroundColor: (theme) =>
                    user.uid === chatActivo
                      ? theme.palette.primary.main
                      : "transparent",
                }}
                key={user.uid}
                onClick={() => {
                  navigate(`chat/?uid=${user.uid}&name=${user.name}`);
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color={user.online ? "success" : "error"}
                    variant="dot"
                  >
                    <Avatar src="https://ptetutorials.com/images/user-profile.png" />
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={user.name} />
              </ListItemButton>
            ))}
        </List>
      </Box>
    </Drawer>
  );
};
