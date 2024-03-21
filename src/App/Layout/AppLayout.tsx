import {
  Appbar,
  ChatDrawer,
  DrawerSidebarDesktop,
  DrawerSidebarMobile,
  Footer,
  MigasDePan,
} from "./components";
import { Suspense, useEffect } from "react";
import { CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import {
  ContentBox,
  ContentBoxAnimation,
  LayoutBox,
  LayoutBox2,
} from "./components/styled";

import { ContentCut } from "@mui/icons-material";
import { Alerta } from "../components/Alertas/Alerta";
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
            <Suspense
              fallback={
                <ContentBoxAnimation
                  height={"100vh"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  className="suspense"
                >
                  <ContentCut sx={{ fontSize: "10rem" }} />
                </ContentBoxAnimation>
              }
            >
              <LayoutBox2>
                <MigasDePan />
                <LayoutBox2>
                  {children} <Alerta />
                </LayoutBox2>
              </LayoutBox2>
            </Suspense>
          </ContentBox>
        </LayoutBox>
        <Footer />
      </LayoutBox>
    </>
  );
};
