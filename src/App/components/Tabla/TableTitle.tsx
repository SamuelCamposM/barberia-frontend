import { Divider, Typography } from "@mui/material";

export const TableTitle = ({
  texto,
  align = "center",
}: {
  texto: string;
  align?: "center" | "left" | "right";
}) => {
  return (
    <>
      <Divider textAlign={align}>
        <Typography
          variant="subtitle1"
          textTransform={"uppercase"}
          color={"secondary"}
        >
          {texto}
        </Typography>
      </Divider>
      <Divider />
    </>
  );
};
