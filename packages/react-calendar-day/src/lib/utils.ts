import {
  addMinutes,
  CalendarApi,
  CalendarProvidedEvent,
  CalendarView,
  CalendarViewConfiguration,
  CalendarViewId,
  CalendarViewMeta
} from "@illostack/react-calendar";

const minMax = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getTimeFromRow = (
  date: Date,
  row: number,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const { rowsPerHour, minutesPerRow, startHour } = calendar.getLayout();

  const hour = Math.floor(row / rowsPerHour);
  const minutes = (row % rowsPerHour) * minutesPerRow;
  const newDate = new Date(date);
  newDate.setHours(startHour + hour);
  newDate.setMinutes(minutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);

  return newDate;
};

const getRowFromTime = (
  date: Date,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const { rowsPerHour, minutesPerRow, startHour } = calendar.getLayout();

  return Math.floor(
    (date.getHours() - startHour) * rowsPerHour +
      (date.getMinutes() + 1) / minutesPerRow
  );
};

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

  const { minutesPerRow, totalRows } = calendar.getLayout();

  const row = minMax(Math.floor((pointerY / height) * totalRows), 0, totalRows);

  const colDate = getDateFromXPosition(pointerX, width, calendar);
  const startAt = getTimeFromRow(colDate, row, calendar);
  const endAt = addMinutes(startAt, minutesPerRow);

  return { startAt, endAt };
};

const getDateFromXPosition = (
  positionX: number,
  containerWidth: number,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const dates = calendar.getDates();

  const index = Math.floor((positionX / containerWidth) * dates.length);

  return dates[index]!.date;
};

const computePositionFromTime = (
  startAt: Date,
  endAt: Date,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const { totalRows, minutesPerRow } = calendar.getLayout();
  const dates = calendar.getDates();
  const totalDates = dates.length;
  const startRow = getRowFromTime(startAt, calendar);
  const duration = endAt.getTime() - startAt.getTime();
  const endRow = startRow + Math.floor(duration / (minutesPerRow * 60 * 1000));
  const dateIndex = dates.findIndex(
    (date) => date.date.toDateString() === startAt.toDateString()
  );

  return {
    top: `${((startRow / totalRows) * 100).toFixed(2)}%`,
    height: `${(((endRow - startRow) / totalRows) * 100).toFixed(2)}%`,
    left: `${((dateIndex / totalDates) * 100).toFixed(2)}%`,
    width: `${((1 / totalDates) * 100).toFixed(2)}%`
  };
};

export {
  computeEventTimeRangeFromPointer,
  computePositionFromTime,
  getDateFromXPosition
};
