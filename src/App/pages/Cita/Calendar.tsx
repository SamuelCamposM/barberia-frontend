import { Box, styled, useTheme } from "@mui/material";
import { format, parse, startOfWeek, getDay } from "date-fns";

import esES from "date-fns/locale/es";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
const locales = {
  es: esES,
};
export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
export const getMessages = () => {
  return {
    allDay: "Todo el día",
    previous: "<",
    next: ">",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay eventos en este rango",
    showMore: (total: number) => `+ Ver más (${total})`,
  };
};
const StyledCalendar = styled(Calendar)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.default,
  // ... puedes añadir más estilos aquí
}));

export const Calendario = () => {
  const theme = useTheme();
  const eventStyleGetter = () => {
    const style = {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    };
    return { style };
  };

  return (
    <Box height={"100%"}>
      <StyledCalendar
        style={{ color: "#fff" }}
        culture="es"
        localizer={localizer}
        events={[
          {
            title: "Evento 1",
            start: new Date(2024, 5, 20, 10, 0), // año, mes (0 basado en índice), día, hora, minuto
            end: new Date(2024, 5, 20, 14, 0),
          },
          {
            title: "Evento 2",
            start: new Date(2024, 5, 21, 12, 0),
            end: new Date(2024, 5, 21, 13, 0),
          },
          // ... añade más eventos aquí
        ]}
        defaultView={"month"}
        slotPropGetter={eventStyleGetter}
        slotGroupPropGetter={eventStyleGetter}
        messages={getMessages()}
        // eventPropGetter={eventStyleGetter}
        dayPropGetter={eventStyleGetter}
        // components={{
        //   event: CalendarEvent,
        // }}

        onDoubleClickEvent={() => {}}
        onSelectEvent={() => {}}
        onView={() => {}}
      />
    </Box>
  );
};

export default Calendario;
