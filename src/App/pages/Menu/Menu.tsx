import { Action } from "../../../interfaces/global";
import { BuscadorPath, TableTitle } from "../../components";
import { Cancel, Create } from "@mui/icons-material";
import { PaperContainerPage } from "../../components/style";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useMenuStore, Tabla, ModalRoute } from "./";
import { validateFunction } from "../../../helpers";
import { useMemo } from "react";

export const Menu = () => {
  const navigate = useNavigate();
  const {
    noTienePermiso,
    openModal,
    itemActive,
    itemDefault,
    setItemActive,
    setOpenModalMenu,
    getPathPage,
    data,
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
      ocultar: !Boolean(itemActive._id),
      onClick() {
        if (!Boolean(itemActive._id)) return;
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
      ocultar: !Boolean(itemActive._id),
      onClick() {
        if (!Boolean(itemActive._id)) return;
        setItemActive(itemDefault);
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

  // const { q = "", buscando = "" } = queryString.parse(location.search) as {
  //   q: string;
  //   buscando: string;
  // };

  const { path } = useMemo(() => getPathPage("Menu", false), [data]);
  return (
    <>
      <TableTitle texto={path} />
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
