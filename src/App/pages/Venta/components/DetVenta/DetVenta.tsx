import { AddCircle, Cancel } from "@mui/icons-material";
import { Dispatch, useEffect, useState } from "react";
import { columns, itemDefault } from "./helpers";
import { DetVentaItem } from "./interfaces";
import { RowDetVenta } from "./components/RowDetVenta";
import { TableHeader } from "../../../../components/Tabla/TableHeader";
import {
  Box,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@mui/material";
import {
  Acciones,
  // Buscador,
  Cargando,
  TablaLayout,
  TableTitle,
} from "../../../../components";
import { EditableDetVenta } from "./components/EditableDetVenta";
import { TableNoData } from "../../../../components/Tabla/TableNoData";
import { Sort } from "../../../../../interfaces/global";
import { VentaItem } from "../../interfaces";
import {
  StyledTableHeaderCell,
  StyledTableRow,
} from "../../../../components/style";

export const DetVenta = ({
  detVentasData,
  sucursal_id,
  valuesVenta: { gastoTotal, totalProductos },
  sort,
  setformValues,
  deshabilitar,
}: {
  detVentasData: DetVentaItem[];
  sucursal_id: string;
  valuesVenta: {
    gastoTotal: number;
    totalProductos: number;
  };
  setSort: Dispatch<React.SetStateAction<Sort>>;
  setformValues: Dispatch<React.SetStateAction<VentaItem>>;
  sort: Sort;
  deshabilitar: boolean;
}) => {
  const [agregando, setAgregando] = useState(false);
  useEffect(() => {
    setAgregando(false);
  }, [sucursal_id]);

  return (
    <>
      {/* <Buscador
        cargando={cargando}
        buscando={false}
        onSearch={(value) => {
          // setBuscando(true);
          // setData({ pagination: paginationDefault, sort, busqueda: value });
        }}
        onSearchCancel={() => {
          // setBuscando(false);
          // setData({ pagination: paginationDefault, sort, busqueda: "" });
        }}
      /> */}
      <TableTitle texto={"Productos"} align="left" />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Acciones
          actions={[
            {
              color: agregando ? "error" : "success",
              Icon: agregando ? Cancel : AddCircle,
              name: "Agregar",
              onClick() {
                setAgregando(!agregando);
              },
              ocultar: deshabilitar,
              tipo: "icono",
            },
          ]}
        />

        {/* <TablePagination
          className="tablePagination"
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={pagination.totalDocs}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
        /> */}
      </Box>
      <TablaLayout maxHeight="30vh">
        <TableHeader
          columns={columns}
          sort={sort}
          //  sortFunction={(a) => {}}
        />
        {false ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + 1}>
                <Cargando titulo="Cargando DetVentas..." />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {agregando && (
              <EditableDetVenta
                detVenta={{ ...itemDefault, crud: { nuevo: true } }}
                deshabilitar={deshabilitar}
                setAgregando={setAgregando}
                setEditando={() => {}}
                setformValues={setformValues}
                sucursal_id={sucursal_id}
              />
            )}
            {detVentasData.length === 0 ? (
              <TableNoData length={columns.length} title="No hay detVentas" />
            ) : (
              detVentasData.map((detVenta) => {
                return (
                  <RowDetVenta
                    deshabilitar={deshabilitar}
                    setformValues={setformValues}
                    key={detVenta._id}
                    detVenta={detVenta}
                    sucursal_id={sucursal_id}
                  />
                );
              })
            )}
          </TableBody>
        )}
        <TableFooter>
          <StyledTableRow>
            <StyledTableHeaderCell></StyledTableHeaderCell>
            <StyledTableHeaderCell></StyledTableHeaderCell>
            <StyledTableHeaderCell> {totalProductos}</StyledTableHeaderCell>
            <StyledTableHeaderCell></StyledTableHeaderCell>
            <StyledTableHeaderCell></StyledTableHeaderCell>
            <StyledTableHeaderCell>$ {gastoTotal}</StyledTableHeaderCell>
          </StyledTableRow>
        </TableFooter>
      </TablaLayout>
    </>
  );
};
