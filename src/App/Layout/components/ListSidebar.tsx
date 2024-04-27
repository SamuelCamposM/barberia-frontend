import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  TextField,
} from "@mui/material";
import { ConvertirIcono } from "../../../helpers/stringToComponents";
import { convertirPath } from "../../../helpers";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../../hooks";
import { useMenuStore } from "../../pages/Menu";
import { StyledListItem } from "./styled";

export const ListSidebar = ({ openSidebar = true }) => {
  const { data, handleChangeComponent, count } = useMenuStore();
  const { usuario } = useAuthStore();
  return (
    <Box sx={{ overflow: "auto" }}>
      <Tooltip title={"Buscar"} followCursor placement="right">
        <StyledListItem disablePadding>
          <TextField
            label="Buscar"
            variant="filled"
            color="primary"
            size="small"
            fullWidth
          />
        </StyledListItem>
      </Tooltip>
      <List>
        {data
          .filter(({ ver }) => ver.includes(usuario.rol))
          .map(({ nombre, _id, icono }) => (
            <Tooltip key={_id} title={nombre} followCursor placement="right">
              <StyledListItem disablePadding>
                <NavLink
                  to={convertirPath(nombre)}
                  onClick={() => {
                    handleChangeComponent(count);
                  }}
                  className={({ isActive }) => {
                    if (isActive) {
                      return "link link--active";
                    }
                    return "link";
                  }}
                >
                  <ListItemButton
                    sx={{
                      p: 0,
                      py: 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {ConvertirIcono(icono, "medium", "primary")}
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
              </StyledListItem>
            </Tooltip>
          ))}
      </List>
    </Box>
  );
};
