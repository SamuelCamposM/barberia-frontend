import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const formatearFecha = (fecha: string) =>
  fecha.trim() === ""
    ? ""
    : format(parseISO(fecha), "hh:mm a, d 'de' MMMM", { locale: es });
