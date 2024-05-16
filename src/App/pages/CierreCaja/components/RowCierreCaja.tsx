import { StaticCierreCaja } from "./StaticCierreCaja";
import { CierreCajaItem } from "../interfaces";
export const RowCierreCaja = ({
  busqueda,
  //separo busqueda por que es el unico que no pasare el editable
  cierreCaja,
}: {
  cierreCaja: CierreCajaItem;
  busqueda?: string;
}) => {
  return (
    <>
      <StaticCierreCaja busqueda={busqueda || ""} cierreCaja={cierreCaja} />
    </>
  );
};
