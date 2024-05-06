import { useMemo } from "react";
import { CompraContext } from "./CompraContext";
import { CompraItem } from "../../interfaces";

export const CompraProvider = ({
  children,
  compra,
}: {
  children: JSX.Element;
  compra: CompraItem;
}) => {
  const value = useMemo(
    () => ({
      id: compra._id || "",
      dataCompra: {
        totalProductos: compra.totalProductos,
        gastoTotal: compra.gastoTotal,
      },
      finalizada: compra.estado === "FINALIZADA",
    }),
    [compra.gastoTotal, compra.totalProductos]
  );

  return (
    <CompraContext.Provider value={value}>{children}</CompraContext.Provider>
  );
};
