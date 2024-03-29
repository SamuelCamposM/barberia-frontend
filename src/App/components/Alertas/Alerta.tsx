import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";

export const Alerta = () => {
  return (
    <>
      {/* asdsad
      <IconButton
        aria-label=""
        onClick={() => {
          toast.error(
            <Confirm
              titulo="Probando"
              actions={[
                {
                  color: "error",
                  Icon: Check,
                  name: "Si",
                  onClick() {
                    console.log("Confirmando");
                  },
                  size: "small",
                  tipo: "boton",
                },
              ]}
            />
          );
        }}
      >
        <NotificationAdd />
      </IconButton> */}
      {/* <ToastContainer
        containerId={"confirm"}
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
        limit={1}
      /> */}
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
        limit={1}
      />
    </>
  );
};
