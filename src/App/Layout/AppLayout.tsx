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
import { ContentBox, LayoutBox, LayoutBox2 } from "./components/styled";
import { useMenuStore } from "../../hooks";

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
            <Suspense fallback={<span>Loading...</span>}>
              <LayoutBox2>
                <MigasDePan />
                {children}
              </LayoutBox2>
            </Suspense>
          </ContentBox>
        </LayoutBox>
        <Footer />
      </LayoutBox>
    </>
  );
};
