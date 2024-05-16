import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
export const formatearFechaSinHoras = (fecha: string) =>
  !fecha
    ? ""
    : fecha.trim() === ""
    ? ""
    : format(parseISO(fecha), "d 'de' MMMM yyyy", { locale: es });

export const formatearFecha = (fecha: string) =>
  !fecha
    ? ""
    : fecha.trim() === ""
    ? ""
    : format(parseISO(fecha), "hh:mm a, d 'de' MMMM", { locale: es });

export const DateTimeFormateadaWithHours = () =>
  format(new Date(), "yyyy-MM-dd'T'HH:mm");
export const DateTimeFormateadaWithoutHours = () =>
  format(new Date(), "yyyy-MM-dd");
