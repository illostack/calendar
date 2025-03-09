import {
  addMinutes,
  CalendarApi,
  CalendarEvent,
  CalendarProvidedEvent,
  CalendarView,
  CalendarViewConfiguration,
  CalendarViewId,
  CalendarViewMeta,
  rowToTime
} from "@illostack/react-calendar";

const minMax = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

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

  const row = minMax(
    Math.floor((pointerY / height) * totalRows),
    0,
    totalRows - 1
  );

  const colDate = getDateFromXPosition(pointerX, width, calendar);
  const startAt = rowToTime(colDate, row, calendar);
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

  return dates[Math.floor((positionX / containerWidth) * dates.length)].date;
};

const computeEventBoundsFromCard = (
  event: CalendarEvent,
  cardBounds: DOMRect,
  containerBounds: DOMRect,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const {
    y: containerY,
    width: containerWidth,
    left: containerLeft
  } = containerBounds;
  const { left: cardLeft, width: cardWidth, top: cardTop } = cardBounds;

  const date = getDateFromXPosition(
    cardLeft - containerLeft + cardWidth / 2,
    containerWidth,
    calendar
  );

  const row = Math.floor(
    (cardTop - containerY) / calendar.getLayout().rowHeight
  );
  const startAt = rowToTime(date, row, calendar);
  const eventDuration = event.endAt.getTime() - event.startAt.getTime();
  const endAt = new Date(startAt.getTime() + eventDuration);

  return { startAt, endAt };
};

export {
  computeEventBoundsFromCard,
  computeEventTimeRangeFromPointer,
  getDateFromXPosition
};
