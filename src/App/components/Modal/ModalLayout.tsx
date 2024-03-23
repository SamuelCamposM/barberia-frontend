import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import Draggable from "react-draggable";

export const ModalLayout = ({
  children,
  idModal,
  open,
  setOpen,
  vh,
  width = {
    lg: "60",
    md: "80",
    xs: "100",
  },
}: {
  children?: JSX.Element;
  idModal: string;
  open: boolean;
  setOpen: (arg: boolean) => void;
  vh: number;
  width?: {
    xs?: string;
    md?: string;
    lg?: string;
  };
}) => {
  return (
    <Modal
      keepMounted
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Grid container>
        <Box
          sx={{
            minHeight: `${vh}vh`,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: `${width.xs}%`,
              md: `${width.md}%`,
              lg: `${width.lg}%`,
            },
            border: "none",
            background: "transparent",
          }}
        >
          <Draggable handle={`#${idModal}`}>
            <Box sx={{ background: (theme) => theme.palette.background.paper }}>
              {children}
            </Box>
          </Draggable>
        </Box>
      </Grid>
    </Modal>
  );
};
