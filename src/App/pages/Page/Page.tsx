import { Action, FromAnotherComponent, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Create, Refresh } from "@mui/icons-material";
import { Box, TableBody } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import { columns, sortDefault } from "./helpers";
import { ModalRoute } from "./components/ModalRoute";
import { PaperContainerPage } from "../../components/style";
import { Route, Routes, useNavigate } from "react-router-dom";
import { StaticPage, PageItem, setDataProps, useSocketEvents } from ".";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { TableNoData } from "../../components/Tabla/TableNoData";
import { useCommonStates } from "../../hooks";

import { usePageStore } from "./hooks/usePageStore";
import queryString from "query-string";
import { getSubPath, validateFunction } from "../../../helpers";
import { Acciones, Buscador, TablaLayout, TableTitle } from "../../components";

export const Page = ({ dontChangePath }: FromAnotherComponent) => {
  // Hooks de navegación y rutas.
  // Importaciones y definiciones de estado
  const navigate = useNavigate();
  const { noTienePermiso, data: dataPage, getPathPage } = usePageStore();
  console.log({ dataPage });

  const { path } = useMemo(() => getPathPage("Page", false), [dataPage]);
  const { setItemActive, setOpenModal, itemActive, openModal, itemDefault } =
    usePageStore();

  const { buscando, busqueda, setBuscando, setBusqueda, setSort, sort } =
    useCommonStates(sortDefault);

  const sortFunction = (newSort: Sort) => {
    setData({ busqueda, sort: newSort });
  };
  const searchFunction = (newBuscando: boolean, value: string) => {
    setBuscando(newBuscando);
    setData({
      sort,
      busqueda: value,
    });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({}: // pagination,
  // sort,
  // busqueda,
  // estado,
  // tipoPage,
  setDataProps) => {
    // setCargando(true);
    // const { error, result } = await getPages({
    //   pagination,
    //   sort,
    //   busqueda,
    //   estado,
    //   tipoPage,
    // });
    // if (error.error) {
    //   toast.error(error.msg);
    //   return;
    // }
    // const { docs, ...rest } = result;
    // setPagination(rest);
    // setPagesData(docs);
    // setSort(sort);
    // setBusqueda(busqueda);
    // setCargando(false);
    // setEstado(estado);
    // setTipoPage(tipoPage);
  };

  // Efectos secundarios para la sincronización con la URL y sockets.
  const {
    q = "",
    buscando: buscandoQuery,
    pagination: paginationQuery,
    sort: sortQuery,
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
  };

  useEffect(() => {
    if (!dontChangePath) {
      let params = new URLSearchParams(window.location.search);
      params.set("q", busqueda);
      params.set("buscando", buscando ? "true" : "false");
      params.set("sort", JSON.stringify(sort));
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [busqueda, buscando, sort]);

  useEffect(() => {
    if (dontChangePath) {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      // setData({
      //   pagination,
      //   sort,
      //   busqueda,
      //   estado,
      //   tipoPage,
      // });
    } else {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      // setData({
      //   pagination: paginationQuery
      //     ? JSON.parse(paginationQuery)
      //     : paginationDefault,
      //   sort: sortQuery ? JSON.parse(sortQuery) : sort,
      //   busqueda: estaBuscando ? q : "",
      //   estado: estadoQuery ? estadoQuery === "true" : estado,
      //   tipoPage: tipoPageQuery,
      // });
    }
  }, []);
  useSocketEvents();
  const nuevoActive = useMemo(() => itemActive.crud?.agregando, [itemActive]);

  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () =>
        setData({
          sort,
          busqueda: q,
        }),
      tipo: "icono",
    },
    {
      color: "success",
      Icon: AddCircle,
      name: "Nuevo",
      tipo: "icono",
      disabled: nuevoActive,
      onClick: async () => {
        const canActive = await setItemActive({
          ...itemDefault,
          crud: { agregando: true },
        });
        if (canActive) {
          let params = new URLSearchParams(window.location.search);

          navigate(`nuevo?${params.toString()}`);
          setOpenModal(true);
        }
      },
    },
    {
      color: nuevoActive ? "success" : "secondary",
      tipo: "icono",
      badge: "index",
      disabled: false,
      Icon: Create,
      name: `Continuar ${nuevoActive ? "Creando" : "Editando"}`,
      ocultar: !Boolean(itemActive._id) && !nuevoActive,
      onClick: () => {
        if (!Boolean(itemActive._id) && !nuevoActive) return;
        setOpenModal(!openModal);
      },
    },
    {
      color: "error",
      tipo: "icono",
      badge: "index",
      disabled: false,
      Icon: Cancel,
      name: `Cancelar ${nuevoActive ? "Creando" : "Edición"}`,
      ocultar: !Boolean(itemActive._id) && !nuevoActive,
      onClick: async () => {
        navigate(getSubPath());
        setItemActive(itemDefault, true);
      },
    },
  ];

  const handleEditar = useCallback(
    async (itemEditing: PageItem) => {
      if (noTienePermiso("Page", "update")) {
        return;
      }

      const canActive = await setItemActive(itemEditing);
      if (canActive) {
        let params = new URLSearchParams(window.location.search);
        navigate(`${itemEditing._id || ""}?${params.toString()}`);
        setOpenModal(!openModal);
      }
    },
    [dataPage, itemActive]
  );

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
          <Route
            path="/:_id"
            element={
              <ModalRoute
                pagesData={dataPage}
                cargando={false}
                prevPath={path}
              />
            }
          />
        </Routes>
        <Buscador
          label="Buscar por Page, Marca y Categoria"
          buscando={buscando}
          cargando={false}
          onSearch={(value) => searchFunction(true, value)}
          onSearchCancel={() => searchFunction(false, "")}
        />

        <TableTitle texto={path} />
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Acciones actions={actions} />
        </Box>
        <TablaLayout>
          <TableHeader
            columns={columns}
            sort={sort}
            sortFunction={sortFunction}
          />

          <TableBody>
            {dataPage.length === 0 ? (
              <TableNoData length={columns.length} title="No hay Page" />
            ) : (
              dataPage.map((page) => {
                return (
                  <StaticPage
                    key={page._id}
                    page={page}
                    busqueda={busqueda}
                    handleEditar={handleEditar}
                    itemActive={itemActive}
                  />
                );
              })
            )}
          </TableBody>
        </TablaLayout>
      </PaperContainerPage>
    </>
  );
};

export default Page;
