import { Divider, Typography } from "@mui/material";

export const Title = ({ path }: { path: string }) => {
  return (
    <>
      <Divider>
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
