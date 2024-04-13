import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { getMunicipios, columns, rowDefault } from "./helpers";
import { MunicipioItem, setDataProps } from "./interfaces";
import { paginationDefault } from "../../../../../helpers";
import { RowMunicipio } from "./components/RowMunicipio";
import { Sort } from "../../../../../interfaces/global";
import { TableHeader } from "../../../../components/Tabla/TableHeader";
import { toast } from "react-toastify";
import { useMenuStore } from "../../../Menu";
import { useMunicipioSocketEvents } from "./hooks/useSocketEvents";
import {
  Box,
  Divider,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Acciones,
  Buscador,
  Cargando,
  TablaLayout,
} from "../../../../components";
import { useCommonStates } from "../../../../hooks";
import { EditableMunicipio } from "./components/EditableMunicipio";
export const TablaMunicipio = ({ depto }: { depto: string }) => {
  const { noTienePermiso } = useMenuStore();
  const {
    agregando,
    buscando,
    busqueda,
    cargando,
    setAgregando,
    setBuscando,
    setBusqueda,
    setCargando,
    setSort,
    sort,
  } = useCommonStates({ asc: true, campo: "name" });

  const [municipiosData, setMunicipiosData] = useState<MunicipioItem[]>([]);
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
  }: Omit<setDataProps, "depto">) => {
    setCargando(true);
    const { error, result } = await getMunicipios({
      pagination,
      sort,
      depto,
      busqueda,
    });
    if (error) {
      return toast.error(error);
    }
    const { docs, ...rest } = result;
    setPagination(rest);
    setMunicipiosData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setCargando(false);
  };

  useEffect(() => {
    setData({ pagination, sort, busqueda });
  }, []);

  useMunicipioSocketEvents({
    depto,
    setPagination,
    setMunicipiosData,
  });

  return (
    <>
      <Buscador
        buscando={buscando}
        onSearch={(value) => {
          setBuscando(true);
          setData({ pagination: paginationDefault, sort, busqueda: value });
        }}
        onSearchCancel={() => {
          setBuscando(false);
          setData({ pagination: paginationDefault, sort, busqueda: "" });
        }}
      />
      <Divider textAlign="left">
        <Typography
          variant="subtitle1"
          textTransform={"uppercase"}
          color={"secondary"}
        >
          Municipios
        </Typography>
      </Divider>
      <Divider />
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
              tipo: "icono",
            },
            {
              color: agregando ? "error" : "success",
              Icon: agregando ? Cancel : AddCircle,
              name: "Agregar",
              onClick() {
                if (noTienePermiso("Depto", "insert")) return;
                setAgregando(!agregando);
              },
              tipo: "icono",
            },
          ]}
        />

        <TablePagination
          className="tablePagination"
          rowsPerPageOptions={[10, 20, 100]}
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
                <Cargando titulo="Cargando Municipios..." />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {agregando && (
              <EditableMunicipio
                setEditando={() => {}}
                municipio={{ ...rowDefault, crud: { nuevo: true } }}
                depto={depto}
                setAgregando={setAgregando}
              />
            )}
            {municipiosData.map((municipio) => {
              return (
                <RowMunicipio
                  busqueda={busqueda}
                  key={municipio._id}
                  municipio={municipio}
                  depto={depto}
                />
              );
            })}
          </TableBody>
        )}
      </TablaLayout>
    </>
  );
};
