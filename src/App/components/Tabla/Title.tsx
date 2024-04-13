import { Divider, Typography } from "@mui/material";

export const Title = ({
  path,
  align = "center",
}: {
  path: string;
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
          {path}
        </Typography>
      </Divider>
      <Divider />
    </>
  );
};
