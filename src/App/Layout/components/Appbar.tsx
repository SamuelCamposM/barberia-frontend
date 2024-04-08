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
import { ContentCut, MenuTwoTone } from "@mui/icons-material";
import { useAuthStore, useUiStore } from "../../../hooks";
import { ModalProfile } from "./ModalProfile";
export const Appbar = () => {
  const { onStartLogout, user } = useAuthStore();
  const { onToogleSidebar, onToogleSidebarMobile, setOpenProfileModal } =
    useUiStore();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={onToogleSidebarMobile}
            >
              <MenuTwoTone />
            </IconButton>
          ) : (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={onToogleSidebar}
            >
              <MenuTwoTone />
            </IconButton>
          )}

          <Box className="boxEmpresa">
            <ContentCut className="logoEmpresa" />
            <Typography variant="h6" noWrap className="textoEmpresa">
              PIBES' BARBERS
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar alt="Remy Sharp" src={user.photo || ""} />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
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
