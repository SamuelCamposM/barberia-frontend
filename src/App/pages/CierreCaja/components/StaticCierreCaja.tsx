import { Action } from "../../../../interfaces/global";
import { CierreCajaItem } from "..";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { formatearFechaSinHoras } from "../../../../helpers";
import { useResaltarTexto } from "../../../hooks";

export const StaticCierreCaja = ({
  cierreCaja,
  busqueda,
}: {
  cierreCaja: CierreCajaItem;
  busqueda: string;
  actionsJoins?: Action[];
}) => {
  return (
    <StyledTableRow
      className={
        cierreCaja.crud?.agregando || cierreCaja.crud?.editado
          ? "animate__animated animate__pulse"
          : ""
      }
      key={cierreCaja._id}
      crud={cierreCaja.crud}
      onDoubleClick={() => {}}
    >
      <StyledTableCell>
        {formatearFechaSinHoras(cierreCaja.fecha)}
      </StyledTableCell>
      <StyledTableCell>
        {useResaltarTexto({
          busqueda,
          texto: cierreCaja.sucursal.name,
        })}
      </StyledTableCell>
      <StyledTableCell>{cierreCaja.totalDinero}</StyledTableCell>
      <StyledTableCell>{cierreCaja.totalCompras}</StyledTableCell>
      <StyledTableCell>{cierreCaja.totalVentas}</StyledTableCell>
    </StyledTableRow>
  );
};
