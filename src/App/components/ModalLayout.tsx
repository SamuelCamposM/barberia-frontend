import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";

export const ModalLayout = ({
  open,
  setOpen,
  children,
  vh,
}: {
  open: boolean;
  setOpen: (arg: boolean) => void;
  children?: JSX.Element;
  vh: number;
}) => {
  return (
    <Modal
      keepMounted
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Grid
        container
        sx={{
          minHeight: `${vh}vh`,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "100%", md: "80%", lg: "60%" },
          bgcolor: "background.paper",
          boxShadow: 24,
        }}
      >
        {children}
      </Grid>
    </Modal>
  );
};
