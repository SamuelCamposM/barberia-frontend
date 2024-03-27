import { Acciones } from "../../components";
import { Action } from "../../../interfaces/global";
import { Add, Cancel, Create } from "@mui/icons-material";
import { ModalRoute } from "./Components/ModalRoute";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { PaperContainerPage } from "../../components/style";
import { SocketContext } from "../../../context";
import { useContext, useEffect } from "react";
import { useMenuStore, PageItem, Tabla } from "./";
import { useTablePagination } from "../../hooks";
import TablePagination from "@mui/material/TablePagination";
import queryString from "query-string";
import { Buscador } from "./Components/Buscador";
import { filterFunction } from "./helpers";

export const Menu = () => {
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const {
    noTienePermiso,
    onEditMenu,
    openModal,
    rowActive,
    rowDefault,
    rows,
    setActiveRow,
    setOpenModalMenu,
  } = useMenuStore();
  const { handleChangePage, handleChangeRowsPerPage, page, rowsPerPage } =
    useTablePagination();

  const actionsLeft: Action[] = [
    {
      Icon: Create,
      bgColor: "secondary",
      name: "Continuar Editando",
      disabled: false,
      ocultar: !Boolean(rowActive._id),
      onClick: () => {
        if (noTienePermiso("Menu", "update")) {
          return;
        }
        if (Boolean(rowActive._id)) {
          setOpenModalMenu(!openModal);
        }
      },
    },
    {
      Icon: Cancel,
      bgColor: "error",
      name: "Cancelar Edición",
      disabled: false,
      ocultar: !Boolean(rowActive._id),
      onClick: () => {
        if (Boolean(rowActive._id) && openModal) return;
        setActiveRow(rowDefault);
        navigate("/menu", { replace: true });
      },
    },
  ];
  const actionsRight: Action[] = [
    {
      Icon: Add,
      bgColor: "success",
      name: "Nuevo",
      disabled: false,
      ocultar: false,
      onClick: () => {
        navigate(`/menu/nuevo${q && `?q=${q}&buscando=${buscando}`}`, {
          replace: true,
        });
        setOpenModalMenu(true);
      },
    },
  ];

  useEffect(() => {
    socket?.on("cliente:page-editar", (data: PageItem) => {
      onEditMenu(data);
    });
  }, [socket]);
  const { q = "", buscando = "" } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
  };

  return (
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (isNaN(Number(e.key)) || !e.altKey) {
          return;
        }
        [...actionsLeft, ...actionsRight][Number(e.key) - 1].onClick(null);
      }}
    >
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/:_id" element={<ModalRoute />} />
        <Route path="/*" element={<Navigate replace to="/" />} />
      </Routes>
      {/* <Routes>
        <Route path="/" element={<></>} />
        <Route path="modal/:item" element={<ModalMenu />} />
        <Route path="/*" element={<Navigate replace to="/" />} />
      </Routes> */}
      <Buscador />
      <Tabla page={page} rowsPerPage={rowsPerPage} />

      <Acciones actionsLeft={actionsLeft} actionsRight={actionsRight} />

      <TablePagination
        className="tablePagination"
        rowsPerPageOptions={[10, 20, 100]}
        component="div"
        count={filterFunction(String(q), String(buscando), rows).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </PaperContainerPage>
  );
};
export default Menu;
