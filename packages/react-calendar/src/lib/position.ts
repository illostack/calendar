import {
  CalendarApi,
  CalendarProvidedEvent,
  CalendarView,
  CalendarViewConfiguration,
  CalendarViewId,
  CalendarViewMeta
} from "../types";

const rowToTime = (
  date: Date,
  row: number,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const { rowsPerHour, minutesPerRow, startHour } = calendar.getLayout();

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    Math.floor(row / rowsPerHour) + startHour,
    (row % rowsPerHour) * minutesPerRow
  );
};

const timeToPosition = (
  date: Date,
  startAt: Date,
  endAt: Date,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const start = new Date(startAt);
  const end = new Date(endAt);

  const selectedDay = date.getDate();
  const startDay = start.getDate();
  const endDay = end.getDate();

  const { rowsPerHour, minutesPerRow, startHour, endHour, endOffset } =
    calendar.getLayout();

  const eventStartHour =
    startDay !== selectedDay ? startHour : start.getHours();
  const eventStartMinute =
    startDay !== selectedDay ? startHour : start.getMinutes();
  const eventEndHour =
    endDay !== selectedDay ? endHour + endOffset : end.getHours();
  const eventEndMinute = endDay !== selectedDay ? startHour : end.getMinutes();

  const minRow = 0;
  const maxRow = rowsPerHour * (endHour - startHour + endOffset);

  const startRow = Math.max(
    eventStartHour * rowsPerHour +
      Math.floor(eventStartMinute / minutesPerRow) -
      startHour * rowsPerHour,
    minRow
  );
  const endRow = Math.min(
    eventEndHour * rowsPerHour +
      Math.floor(eventEndMinute / minutesPerRow) -
      startHour * rowsPerHour,
    maxRow
  );

  const { rowHeight } = calendar.getLayout();

  const top = startRow * rowHeight;
  const bottom = endRow * rowHeight;
  const height = bottom - top;

  return { top, height, left: 0, right: 0 };
};

export { rowToTime, timeToPosition };
