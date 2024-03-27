import { Action } from "../../../interfaces/global";
import { Cancel, Create } from "@mui/icons-material";
import { Buscador } from "./Components/Buscador";
import { ModalRoute } from "./Components/ModalRoute";
import { PaperContainerPage } from "../../components/style";
import { Route, Routes, useNavigate } from "react-router-dom";
import { SocketContext } from "../../../context";
import { useContext, useEffect } from "react";
import { useMenuStore, PageItem, Tabla } from "./";
import { usePath } from "../../hooks";

export const Menu = () => {
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const path = usePath();
  const {
    noTienePermiso,
    onEditMenu,
    openModal,
    rowActive,
    rowDefault,
    setActiveRow,
    setOpenModalMenu,
  } = useMenuStore();

  const actions: Action[] = [
    {
      color: "secondary",
      tipo: "icono",
      variant: "contained",
      badge: "index",
      disabled: false,
      Icon: Create,
      name: "Continuar Editando",
      ocultar: !Boolean(rowActive._id),
      onClick() {
        if (noTienePermiso("Menu", "update")) {
          return;
        }
        if (this && this.ocultar) return;
        setOpenModalMenu(!openModal);
      },
    },
    {
      color: "error",
      tipo: "icono",
      badge: "index",
      disabled: false,
      Icon: Cancel,
      name: "Cancelar Edición",
      ocultar: !Boolean(rowActive._id),
      onClick: () => {
        if (!Boolean(rowActive._id)) return;
        setActiveRow(rowDefault);
        navigate(`/${path}`, { replace: true });
      },
    },
    // {
    //   badge: "index",
    //   color: "error",
    //   disabled: false,
    //   Icon: Add,
    //   name: "Nuevo",
    //   ocultar: true,
    //   tipo: "icono",
    //   onClick() {
    //     if (this.ocultar) return;

    //     navigate(`/${path}/nuevo${q && `?q=${q}&buscando=${buscando}`}`, {
    //       replace: true,
    //     });
    //     setOpenModalMenu(true);
    //   },
    // },
  ];

  useEffect(() => {
    socket?.on("cliente:page-editar", (data: PageItem) => {
      onEditMenu(data);
    });
  }, [socket]);

  // const { q = "", buscando = "" } = queryString.parse(location.search) as {
  //   q: string;
  //   buscando: string;
  // };

  return (
    <>
      <PaperContainerPage
        tabIndex={-1}
        onKeyDown={(e) => {
          if (isNaN(Number(e.key)) || !e.altKey) {
            return;
          }
          actions[Number(e.key) - 1].onClick(null);
        }}
      >
        <Routes>
          <Route path="/:_id" element={<ModalRoute />} />
        </Routes>
        <Buscador />

        <Tabla actions={actions} />
      </PaperContainerPage>
    </>
  );
};
export default Menu;
