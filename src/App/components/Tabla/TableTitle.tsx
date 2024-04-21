import { Box, Divider, Typography } from "@mui/material";

export const TableTitle = ({
  texto,
  align = "center",
  Tabs,
}: {
  texto: string;
  align?: "center" | "left" | "right";
  Tabs?: JSX.Element;
}) => {
  return (
    <>
      <Box display={"flex"} alignItems={"center"} flexWrap={"wrap-reverse"}>
        {Tabs}
        <Divider textAlign={align} sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            textTransform={"uppercase"}
            color={"secondary"}
          >
            {texto}
          </Typography>
        </Divider>
      </Box>
      <Divider />
    </>
  );
};
