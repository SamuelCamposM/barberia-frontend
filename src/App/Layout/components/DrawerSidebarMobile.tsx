import { Drawer, Toolbar } from "@mui/material";
import { useUiStore } from "../../../hooks";
import { ListSidebar } from "./ListSidebar";
const drawerWidthOpen = 240;
export const DrawerSidebarMobile = () => {
  const { openDrawerSidebarMobile, onToogleSidebarMobile } = useUiStore();

  return (
    <Drawer
      variant={"temporary"}
      onClose={onToogleSidebarMobile}
      open={openDrawerSidebarMobile}
      sx={{
        transitionProperty: "width",
        width: drawerWidthOpen,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          borderRight: "none",
          transitionDuration: ".3s",
          transitionProperty: "width",
          width: drawerWidthOpen,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <ListSidebar />
    </Drawer>
  );
};
