import {
  CalendarApi,
  CalendarProvidedEvent,
  CalendarView,
  CalendarViewConfiguration,
  CalendarViewId,
  CalendarViewMeta
} from "@illostack/react-calendar";

const computeEventTimeRangeFromPointer = (
  e: MouseEvent,
  container: HTMLDivElement,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const { clientX, clientY } = e;
  const { width, height, top, left } = container.getBoundingClientRect();
  const pointerY = clientY - top;
  const pointerX = clientX - left;

  const dates = calendar.getDates();
  const monthRows = Math.floor(dates.length / 7);
  const monthCols = 7;

  const row = Math.floor((pointerY / height) * monthRows);
  const col = Math.floor((pointerX / width) * monthCols);

  const date = dates.at(row * monthCols + col)?.date as Date;

  const startAt = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0
  );
  const endAt = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    24,
    0
  );

  return { startAt, endAt };
};

const computePositionFromTime = (
  date: Date,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const dates = calendar.getDates();
  const monthRows = Math.floor(dates.length / 7);
  const monthCols = 7;

  const dateIndex = dates.findIndex((d) => {
    return d.date.toDateString() === date.toDateString();
  });

  const dateRowIndex = Math.floor(dateIndex / monthCols);
  const dateColIndex = dateIndex % monthCols;

  return {
    top: `${((dateRowIndex / monthRows) * 100).toFixed(2)}%`,
    height: `${((1 / monthRows) * 100).toFixed(2)}%`,
    left: `${((dateColIndex / monthCols) * 100).toFixed(2)}%`,
    width: `${((1 / monthCols) * 100).toFixed(2)}%`
  };
};

export { computeEventTimeRangeFromPointer, computePositionFromTime };
