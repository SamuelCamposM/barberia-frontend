import {
  Appbar,
  ChatDrawer,
  DrawerSidebarDesktop,
  DrawerSidebarMobile,
  Footer,
  MigasDePan,
} from "./components";
import { Cargando } from "../components";
import { LayoutBox, LayoutBox2 } from "./components/styled";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Suspense, useEffect } from "react";
import { useMenuStore } from "../pages/Menu";
import { useUiStore } from "../../hooks";
const drawerWidthClose = 56;
const drawerWidthOpen = 240;
export const AppLayout = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const { getDataMenu } = useMenuStore();
  const { openDrawerSidebar } = useUiStore();
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    getDataMenu();
  }, []);
  return (
    <>
      <CssBaseline />
      <ChatDrawer />
      <LayoutBox>
        <Appbar />
        <LayoutBox className="row">
          {isMdDown ? (
            <DrawerSidebarMobile drawerWidthOpen={drawerWidthOpen} />
          ) : (
            <DrawerSidebarDesktop
              drawerWidthClose={drawerWidthClose}
              drawerWidthOpen={drawerWidthOpen}
            />
          )}
          <Box
            sx={{
              width: isMdDown
                ? "100%"
                : openDrawerSidebar
                ? `calc(100% - ${drawerWidthOpen}px)`
                : `calc(100% - ${drawerWidthClose}px)`,
              transitionDuration: "0.3s",
              transitionProperty: "width",
            }}
          >
            <Suspense fallback={<Cargando />}>
              <LayoutBox2>
                <MigasDePan />
                <LayoutBox2>{children}</LayoutBox2>
              </LayoutBox2>
            </Suspense>
          </Box>
        </LayoutBox>
        <Footer />
      </LayoutBox>
    </>
  );
};
