import { Box, Theme, Typography, styled } from "@mui/material";

export const StyledModalBoxHeader = styled(Box)(
  ({ theme }: { theme: Theme }) => ({
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  })
);

export const StyledTypographyHeader = styled(Typography)(
  ({ theme }: { theme: Theme }) => ({
    fontSize: "1.8rem",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
  })
);

export const StyledContainerForm = styled(Box)<{
  height: number;
  headerHeight: number;
  footerHeight: number;
}>(({ height, headerHeight, footerHeight, theme }) => ({
  height: `calc(${height}vh - ${footerHeight + headerHeight}px)`,
  padding: theme.spacing(1),
  overflow: "scroll",
}));

export const StyledGridContainer = styled(Box)<{
  xs?: number;
  md?: number;
  lg?: number;
}>(({ xs = 1, md = 2, lg = 2, theme }) => ({
  display: "grid",
  columnGap: theme.spacing(1),
  [theme.breakpoints.up("xs")]: {
    gridTemplateColumns: `repeat(${xs}, 1fr)`,
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: `repeat(${md}, 1fr)`,
  },
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: `repeat(${lg}, 1fr)`,
  },

  "& .fullWidth": {
    gridColumn: "1 / -1",
  },
}));

export const StyledModalBoxFooter = styled(Box)(
  ({ theme }: { theme: Theme }) => ({
    borderTop: `1px solid ${theme.palette.primary.main}`,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  })
);

export const StyledTypographyFooter = styled(Typography)(
  ({ theme }: { theme: Theme }) => ({
    textTransform: "uppercase",
    fontWeight: "bold",
  })
);

export const StyledTypographyFooterSpan = styled(Typography)(
  ({ theme }: { theme: Theme }) => ({
    fontSize: "1.5rem",
    textTransform: "uppercase",
    fontWeight: "bold",
  })
);
