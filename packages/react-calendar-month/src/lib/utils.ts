import {
  CalendarApi,
  CalendarEvent,
  CalendarProvidedEvent,
  CalendarView,
  CalendarViewConfiguration,
  CalendarViewId,
  CalendarViewMeta
} from "@illostack/react-calendar";

const getDateFromPointerPosition = (
  pointerX: number,
  pointerY: number,
  containerBounds: DOMRect,
  calendar: CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
) => {
  const { width, height } = containerBounds;

  const dates = calendar.getDates();
  const monthRows = Math.floor(dates.length / 7);
  const monthCols = 7;

  const row = Math.floor((pointerY / height) * monthRows);
  const col = Math.floor((pointerX / width) * monthCols);

  const date = dates.at(row * monthCols + col)?.date as Date;

  const startAtDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0
  );
  const endAtDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59
  );

  return { startAt: startAtDate, endAt: endAtDate };
};

const computeMonthEventBounds = (
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

  const startAtDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    event.startAt.getHours(),
    event.startAt.getMinutes()
  );
  const endAtDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    event.endAt.getHours(),
    event.endAt.getMinutes()
  );

  return { startAt: startAtDate, endAt: endAtDate };
};

export { computeMonthEventBounds, getDateFromPointerPosition };
