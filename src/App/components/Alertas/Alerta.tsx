import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";

export const Alerta = () => {
  // const notify = () =>
  //   toast.success(
  //     <DataAlerta titulo="Si" subtitulo="no" enlace="sucursal_editado" />
  //   );
  return (
    <>
      {/* <IconButton aria-label="" onClick={notify}>
        <NotificationAdd />
      </IconButton> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
};
