import {
  Box,
  Collapse,
  Divider,
  List,
  TextField,
  Tooltip,
} from "@mui/material";

import { StyledListItem } from "../styled";
import { useAuthStore } from "../../../../hooks";
import { PageItem, usePageStore } from "../../../pages/Page";
import { useMemo, useState } from "react";
import { convertirPath } from "../../../../helpers";
import { agregarTransparencia } from "../../../../helpers/ui/agregarTransparencia";
import { SidebarItem } from "./SidebarItem";

const generarRutas = (
  data: PageItem[],
  openSidebar: boolean,
  setOpen: React.Dispatch<React.SetStateAction<{ [x: string]: boolean }>>,
  open: { [x: string]: boolean },
  padreId: string = "",
  path = ""
) => {
  return data
    .filter(({ padre }) => padre === padreId)
    .map((page) => {
      const newPath = path + convertirPath(page.nombre);
      return (
        <>
          <SidebarItem
            openSidebar={openSidebar}
            setOpen={setOpen}
            open={open}
            page={page}
            newPath={newPath}
          />
          {page.tipo == "SECCION" && (
            <Collapse in={open[page._id!]}>
              <Divider> {page.nombre}</Divider>
              <List
                sx={{
                  background: (theme) =>
                    agregarTransparencia(theme.palette.secondary.dark, 0.1),
                }}
              >
                {generarRutas(
                  data,
                  openSidebar,
                  setOpen,
                  open,
                  page._id,
                  newPath + "/"
                )}
              </List>
            </Collapse>
          )}
        </>
      );
    });
};

export const ListSidebar = ({ openSidebar = true }) => {
  const [open, setOpen] = useState<{ [x: string]: boolean }>({});

  const { data } = usePageStore();
  const { usuario } = useAuthStore();
  const dataFilter = useMemo(
    () => data.filter(({ ver }) => ver.includes(usuario.rol)),
    [usuario, data]
  );
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
      <List>{generarRutas(dataFilter, openSidebar, setOpen, open)}</List>
    </Box>
  );
};
