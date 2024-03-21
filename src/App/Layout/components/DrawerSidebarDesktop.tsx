import { Drawer, Toolbar } from "@mui/material";
import { ListSidebar } from "./ListSidebar";
import { useUiStore } from "../../../hooks";

const drawerWidthClose = 56;
const drawerWidthOpen = 240;
export const DrawerSidebarDesktop = () => {
  const { openDrawerSidebar } = useUiStore();
  return (
    <Drawer
      variant={"permanent"}
      sx={{
        transitionProperty: "width",
        width: openDrawerSidebar ? drawerWidthOpen : drawerWidthClose,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          borderRight: "none",
          transitionDuration: ".3s",
          transitionProperty: "width",
          width: openDrawerSidebar ? drawerWidthOpen : drawerWidthClose,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <ListSidebar openSidebar={openDrawerSidebar} />
      <Toolbar />
    </Drawer>
  );
};
