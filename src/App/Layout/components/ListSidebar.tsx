import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuthStore, useMenuStore } from "../../../hooks";
import { convertirPath } from "../../../helpers";
import { ConvertirIcono } from "../../helpers/stringToComponents";
export const ListSidebar = ({ openSidebar = true }) => {
  const { rows } = useMenuStore();
  const { user } = useAuthStore();
  return (
    <Box sx={{ overflow: "auto" }}>
      <List>
        {rows
          .filter(({ ver }) => ver.includes(user.rol))
          .map(({ nombre, _id, icono }) => (
            <Tooltip key={_id} title={nombre} followCursor placement="right">
              <ListItem disablePadding>
                <NavLink
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    color: "white",
                  }}
                  to={convertirPath(nombre)}
                  className={({ isActive }) => {
                    if (isActive) {
                      return "grey";
                    }
                  }}
                >
                  <ListItemButton
                    sx={{
                      p: 0,
                      py: 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      {ConvertirIcono(icono)}
                    </ListItemIcon>
                    <ListItemText
                      sx={{ padding: 0, margin: 0 }}
                      primary={openSidebar ? nombre : ""}
                    />
                  </ListItemButton>
                </NavLink>
                {/* <IconButton
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 0.75,
                  margin: 0,
                }}
              >
                <ExpandMore />
              </IconButton> */}
              </ListItem>
            </Tooltip>
          ))}
      </List>
    </Box>
  );
};
