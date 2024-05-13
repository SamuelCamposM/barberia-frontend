import { TableBody, TableCell, TableRow } from "@mui/material";
import {
  Cargando,
  TablaLayout,
  TableHeader,
  TableTitle,
} from "../../../components";
import { columnsStocks } from "../helpers";
import { useHttp } from "../../../hooks";
import { SucursalForeign } from "../../Sucursal";
import { StyledTableCell, StyledTableRow } from "../../../components/style";

interface Stock {
  sucursal: SucursalForeign;
  cantidad: number;
  _id: string;
}
export const StocksProducto = ({ _id }: { _id: string }) => {
  const { data, loading } = useHttp<{ stocks: Stock[] }, { _id: string }>({
    initialUrl: "/producto/getProductoStock",
    initialMethod: "post",
    initialBody: {
      _id,
    },
    initialData: { stocks: [] },
    fetchOnMount: true,
  });

  return (
    <>
      <TableTitle texto={"Stocks"} align="left" />

      <TablaLayout maxHeight="30vh">
        <TableHeader columns={columnsStocks} sortFunction={() => {}} />
        {loading ? (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={
                  // columns.length
                  columnsStocks.length + 1
                }
              >
                <Cargando titulo="Cargando Stocks..." />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {data.stocks.map((item) => {
              return (
                <StyledTableRow key={item._id}>
                  <StyledTableCell>
                    {item.sucursal.name} - {item.sucursal.tel}
                  </StyledTableCell>
                  <StyledTableCell>{item.cantidad}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        )}
      </TablaLayout>
    </>
  );
};
