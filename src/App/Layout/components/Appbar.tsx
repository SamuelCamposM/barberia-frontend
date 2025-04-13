import * as React from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AppBarHeader } from "./styled";
import { MenuTwoTone } from "@mui/icons-material";
import { useAuthStore, useUiStore } from "../../../hooks";
import { ModalProfile } from "./ModalProfile";
export const Appbar = () => {
  const { onStartLogout, usuario } = useAuthStore();
  const { onToogleSidebar, onToogleSidebarMobile, setOpenProfileModal } =
    useUiStore();

  const [anchorElUsuario, setAnchorElUsuario] =
    React.useState<null | HTMLElement>(null);

  const handleOpenUsuarioMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUsuario(event.currentTarget);
  };
  const handleCloseUsuarioMenu = () => {
    setAnchorElUsuario(null);
  };
  const isMdDown = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  return (
    <>
      <ModalProfile />
      <AppBarHeader position="sticky">
        <Toolbar disableGutters className="toolbar">
          {isMdDown ? (
            <IconButton
              size="large"
              aria-label="account of current usuario"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={onToogleSidebarMobile}
            >
              <MenuTwoTone />
            </IconButton>
          ) : (
            <IconButton
              size="large"
              aria-label="account of current usuario"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={onToogleSidebar}
            >
              <MenuTwoTone />
            </IconButton>
          )}

          <Box className="boxEmpresa">
            <Typography variant="h6" noWrap className="textoEmpresa">
              BETTLE SHOES
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUsuarioMenu}>
                <Avatar alt="Remy Sharp" src={usuario.photo || ""} />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUsuario}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={Boolean(anchorElUsuario)}
              onClose={handleCloseUsuarioMenu}
            >
              <MenuItem
                onClick={() => {
                  setOpenProfileModal(true);
                }}
              >
                <Typography
                  width={"100%"}
                  textAlign={"center"}
                  color={"primary"}
                >
                  MIS DATOS
                </Typography>
              </MenuItem>
              <MenuItem onClick={onStartLogout}>
                <Typography width={"100%"} textAlign={"center"} color={"error"}>
                  CERRAR SESIÓN
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBarHeader>
    </>
  );
};
