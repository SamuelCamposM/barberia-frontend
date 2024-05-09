import { createContext } from "react"; 

interface CompraState {
  id: string;
  dataCompra: {
    totalProductos: number;
    gastoTotal: number;
  };
  finalizada: boolean;
}

// Proporciona un valor por defecto
const defaultValue: CompraState = {
  id: "",
  dataCompra: {
    totalProductos: 0,
    gastoTotal: 0,
  },
  finalizada: false,
};

export const CompraContext = createContext<CompraState>(defaultValue);
