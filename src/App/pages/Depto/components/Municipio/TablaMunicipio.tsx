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
import { ChangeEvent, useEffect, useState } from "react";
import { Column, Sort } from "../../../../../interfaces/global";
import { SocketOnMunicipio, getMunicipios } from "./helpers";
import { paginationDefault } from "../../../../../helpers";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { TableHeader } from "../../../../components/Tabla/TableHeader";
import { toast } from "react-toastify";
import { Municipio, setDataProps } from "./interfaces";
import { RowMunicipio } from "./RowMunicipio";
import { useMenuStore } from "../../../Menu";
import { useProvideSocket } from "../../../../../hooks";

const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },
  { campo: "name", label: "Nombre", minWidth: 40, sortable: true },
];
const rowDefault: Municipio = {
  depto: "",
  name: "",
};

export const TablaMunicipio = ({ depto }: { depto: string }) => {
  const { noTienePermiso } = useMenuStore();
  const { socket } = useProvideSocket();
  const [agregando, setAgregando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [busqueda, setbusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [municipiosData, setMunicipiosData] = useState<Municipio[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);
  const [sort, setSort] = useState<Sort>({ asc: true, campo: "name" });
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
      return toast.error("Hubo un error al traer los municipios");
    }
    const { docs, ...rest } = result;
    setPagination(rest);
    setMunicipiosData(docs);
    setSort(sort);
    setbusqueda(busqueda);
    setCargando(false);
  };

  useEffect(() => {
    setData({ pagination, sort, busqueda });
  }, []);

  useEffect(() => {
    socket?.on(`${SocketOnMunicipio.agregar}.${depto}`, (data: Municipio) => {
      setMunicipiosData((prev) => [
        { ...data, crud: { nuevo: true } },
        ...prev,
      ]);
    });
    socket?.on(`${SocketOnMunicipio.editar}.${depto}`, (data: Municipio) => {
      setMunicipiosData((prev) =>
        prev.map((municipioItem) =>
          municipioItem._id === data._id
            ? { ...data, crud: { editado: true } }
            : municipioItem
        )
      );
    });
    socket?.on(
      `${SocketOnMunicipio.eliminar}.${depto}`,
      (data: { _id: string }) => {
        setMunicipiosData((prev) =>
          prev.filter((municipioItem) => municipioItem._id !== data._id)
        );
      }
    );
    return () => {
      socket?.off(`${SocketOnMunicipio.agregar}.${depto}`);
      socket?.off(`${SocketOnMunicipio.editar}.${depto}`);
      socket?.off(`${SocketOnMunicipio.eliminar}.${depto}`);
    };
  }, []);

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
              <RowMunicipio
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
