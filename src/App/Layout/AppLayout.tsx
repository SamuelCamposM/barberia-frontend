import {
  Appbar,
  ChatDrawer,
  DrawerSidebarDesktop,
  DrawerSidebarMobile,
  Footer,
  MigasDePan,
} from "./components";
import { Cargando } from "../components";
import { ContentBox, LayoutBox, LayoutBox2 } from "./components/styled";
import { CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Suspense, useEffect } from "react";
import { useMenuStore } from "../pages/Menu";

export const AppLayout = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));
  const { getDataMenu } = useMenuStore();
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
          {isMdDown ? <DrawerSidebarMobile /> : <DrawerSidebarDesktop />}
          <ContentBox>
            <Suspense fallback={<Cargando />}>
              <LayoutBox2>
                <MigasDePan />
                <LayoutBox2>{children}</LayoutBox2>
              </LayoutBox2>
            </Suspense>
          </ContentBox>
        </LayoutBox>
        <Footer />
      </LayoutBox>
    </>
  );
};
