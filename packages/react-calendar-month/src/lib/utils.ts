import {
  CalendarApi,
  CalendarEvent,
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
    height: containerHeight,
    left: containerLeft
  } = containerBounds;
  const { left: cardLeft, width: cardWidth, top: cardTop } = cardBounds;

  const dates = calendar.getDates();

  const monthRows = Math.floor(dates.length / 7);
  const row = Math.floor(
    (cardTop - containerY) / (containerHeight / monthRows)
  );
  const column = Math.floor(
    (cardLeft - containerLeft + cardWidth / 2) / (containerWidth / 7)
  );

  const date = dates.at(row * 7 + column)?.date as Date;

  const startAt = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    event.startAt.getHours(),
    event.startAt.getMinutes()
  );
  const eventDuration = event.endAt.getTime() - event.startAt.getTime();
  const endAt = new Date(startAt.getTime() + eventDuration);

  return { startAt, endAt };
};

export { computeEventBoundsFromCard, computeEventTimeRangeFromPointer };
