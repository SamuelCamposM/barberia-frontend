import { AddCircle, Cancel } from "@mui/icons-material";
import { Dispatch, useState } from "react";
import { columns, itemDefault } from "./helpers";
import { DetCompraItem } from "./interfaces";
import { RowDetCompra } from "./components/RowDetCompra";
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
import { EditableDetCompra } from "./components/EditableDetCompra";
import { TableNoData } from "../../../../components/Tabla/TableNoData";
import { Sort } from "../../../../../interfaces/global";
import { CompraItem } from "../../interfaces";
import {
  StyledTableHeaderCell,
  StyledTableRow,
} from "../../../../components/style";

export const DetCompra = ({
  detComprasData,
  valuesCompra: { finalizada, dataCompra },
  sort,
  setformValues,
}: {
  detComprasData: DetCompraItem[];
  valuesCompra: {
    id: string;
    dataCompra: {
      totalProductos: number;
      gastoTotal: number;
    };
    finalizada: boolean;
  };
  setSort: Dispatch<React.SetStateAction<Sort>>;
  setformValues: Dispatch<React.SetStateAction<CompraItem>>;
  sort: Sort;
}) => {
  const [agregando, setAgregando] = useState(false);
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
              ocultar: finalizada,
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
                <Cargando titulo="Cargando DetCompras..." />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {agregando && (
              <EditableDetCompra
                finalizada={finalizada}
                setformValues={setformValues}
                setEditando={() => {}}
                detCompra={{ ...itemDefault, crud: { nuevo: true } }}
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
                    setformValues={setformValues}
                    key={detCompra._id}
                    detCompra={detCompra}
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
            <StyledTableHeaderCell>
              {" "}
              {dataCompra.totalProductos}
            </StyledTableHeaderCell>
            <StyledTableHeaderCell></StyledTableHeaderCell>
            <StyledTableHeaderCell>
              $ {dataCompra.gastoTotal}
            </StyledTableHeaderCell>
          </StyledTableRow>
        </TableFooter>
      </TablaLayout>
    </>
  );
};
