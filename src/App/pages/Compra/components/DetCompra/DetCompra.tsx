import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { getDetCompras, columns, itemDefault } from "./helpers";
import { DetCompraItem, setDataProps } from "./interfaces";
import { paginationDefault, rowsPerPageOptions } from "../../../../../helpers";
import { RowDetCompra } from "./components/RowDetCompra";
import { Sort } from "../../../../../interfaces/global";
import { TableHeader } from "../../../../components/Tabla/TableHeader";
import { toast } from "react-toastify";
import { useMenuStore } from "../../../Menu";
import { useDetCompraSocketEvents } from "./hooks/useSocketEvents";
import {
  Box,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
} from "@mui/material";
import {
  Acciones,
  // Buscador,
  Cargando,
  TablaLayout,
  TableTitle,
} from "../../../../components";
import { useCommonStates } from "../../../../hooks";
import { EditableDetCompra } from "./components/EditableDetCompra";
import { TableNoData } from "../../../../components/Tabla/TableNoData";
export const DetCompra = ({
  compra,
  finalizada,
}: {
  compra: string;
  finalizada: boolean;
}) => {
  const { noTienePermiso } = useMenuStore();
  const {
    agregando,
    // buscando,
    busqueda,
    cargando,
    setAgregando,
    // setBuscando,
    setBusqueda,
    setCargando,
    setSort,
    sort,
  } = useCommonStates({ asc: true, campo: "name" });

  const [detComprasData, setDetComprasData] = useState<DetCompraItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);
  const handleChangePage = (_: unknown, newPage: number) => {
    setData({
      pagination: { ...pagination, page: newPage + 1 },
      sort,
      busqueda: "",
    });
  };
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
      sort,
      busqueda: "",
    });
  };
  const sortFunction = (newSort: Sort) => {
    setData({
      pagination,
      sort: newSort,
      busqueda: "",
    });
  };

  const setData = async ({
    pagination,
    sort,
    busqueda,
  }: Omit<setDataProps, "compra">) => {
    setCargando(true);
    const { error, result } = await getDetCompras({
      pagination,
      sort,
      compra,
      busqueda,
    });
    if (error.error) {
      return toast.error(error.msg);
    }
    const { docs, ...rest } = result;
    setPagination(rest);
    setDetComprasData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setCargando(false);
  };

  useEffect(() => {
    setData({ pagination, sort, busqueda });
  }, []);

  useDetCompraSocketEvents({
    compra,
    setPagination,
    setDetComprasData,
  });

  return (
    <>
      {/* <Buscador
        cargando={cargando}
        buscando={buscando}
        onSearch={(value) => {
          setBuscando(true);
          setData({ pagination: paginationDefault, sort, busqueda: value });
        }}
        onSearchCancel={() => {
          setBuscando(false);
          setData({ pagination: paginationDefault, sort, busqueda: "" });
        }}
      /> */}
      <TableTitle texto={"DetCompras"} align="left" />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Acciones
          actions={[
            {
              color: "primary",
              Icon: Refresh,
              name: "Actualizar",
              onClick() {
                setData({ pagination, sort, busqueda });
              },
              ocultar: finalizada,
              tipo: "icono",
            },
            {
              color: agregando ? "error" : "success",
              Icon: agregando ? Cancel : AddCircle,
              name: "Agregar",
              onClick() {
                if (noTienePermiso("Compra", "insert")) return;
                setAgregando(!agregando);
              },
              ocultar: finalizada,
              tipo: "icono",
            },
          ]}
        />

        <TablePagination
          className="tablePagination"
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={pagination.totalDocs}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <TablaLayout maxHeight="30vh">
        <TableHeader
          columns={columns}
          sort={sort}
          sortFunction={sortFunction}
        />
        {cargando ? (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={
                  // columns.length
                  columns.length + 1
                }
              >
                <Cargando titulo="Cargando DetCompras..." />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {agregando && (
              <EditableDetCompra
                setEditando={() => {}}
                detCompra={{ ...itemDefault, crud: { nuevo: true } }}
                compra={compra}
                setAgregando={setAgregando}
              />
            )}
            {detComprasData.length === 0 ? (
              <TableNoData length={columns.length} title="No hay detCompras" />
            ) : (
              detComprasData.map((detCompra) => {
                return (
                  <RowDetCompra
                    finalizada={finalizada}
                    busqueda={busqueda}
                    key={detCompra._id}
                    detCompra={detCompra}
                    compra={compra}
                  />
                );
              })
            )}
          </TableBody>
        )}
      </TablaLayout>
    </>
  );
};
