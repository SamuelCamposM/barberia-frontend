import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";

export const ModalLayout = ({
  open,
  setOpen,
  children,
}: {
  open: boolean;
  setOpen: (arg: boolean) => void;
  children?: JSX.Element;
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
          minHeight: "100vh",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { sx: "100%", md: "80%", lg: "60%" },
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
        }}
      >
        {children}
      </Grid>
    </Modal>
  );
};
