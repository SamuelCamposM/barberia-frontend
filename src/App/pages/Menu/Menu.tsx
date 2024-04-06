import { Action } from "../../../interfaces/global";
import { BuscadorPath } from "../../components";
import { Cancel, Create } from "@mui/icons-material";
import { PaperContainerPage } from "../../components/style";
import { Route, Routes, useNavigate } from "react-router-dom";
import { SocketContext } from "../../../context";
import { useContext, useEffect } from "react";
import { useMenuStore, PageItem, Tabla, ModalRoute } from "./";
import { usePath } from "../../hooks";
import { validateFunction } from "../../../helpers";

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
        if (this && this.ocultar) return;
        if (noTienePermiso("Menu", "update")) {
          return;
        }
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
      onClick() {
        if (this && this.ocultar) return;
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
    return () => {
      socket?.off("cliente:page-editar");
    };
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
          if (validateFunction(e)) return;
          actions[Number(e.key) - 1].onClick(null);
        }}
      >
        <Routes>
          <Route path="/:_id" element={<ModalRoute />} />
        </Routes>
        <BuscadorPath />

        <Tabla actions={actions} />
      </PaperContainerPage>
    </>
  );
};
export default Menu;
