import { Box, Typography } from "@mui/material";
import { Acciones } from "..";
import { Action } from "../../../interfaces/global";
import { ToastPosition } from "react-toastify";

interface confirmConfigurationProperties {
  autoClose: number | false | undefined;
  position: ToastPosition | undefined;
  containerId: string;
}
export const confirmConfiguration: confirmConfigurationProperties = {
  autoClose: undefined,
  position: "top-center",
  containerId: "confirm",
};
export const Confirm = ({
  titulo,
  actions,
}: {
  titulo: string;
  actions: Action[];
}) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Typography variant="subtitle2">{titulo}</Typography>
      <Acciones actions={actions} />
    </Box>
  );
};
