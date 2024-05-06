import { createContext } from "react"; 

interface CompraState {
  id: string;
  data: {
    totalProductos: number;
    gastoTotal: number;
  };
  finalizada: boolean;
}

// Proporciona un valor por defecto
const defaultValue: CompraState = {
  id: "",
  data: {
    totalProductos: 0,
    gastoTotal: 0,
  },
  finalizada: false,
};

export const CompraContext = createContext<CompraState>(defaultValue);
