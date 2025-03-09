import {
  CalendarApi,
  CalendarEvent,
  CalendarProvidedEvent,
  CalendarView,
  CalendarViewConfiguration,
  CalendarViewId,
  CalendarViewMeta,
  rowToTime
} from "@illostack/react-calendar";

const getDateFromXPositon = (
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

const computeDayEventBounds = (
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

  const date = getDateFromXPositon(
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

export { computeDayEventBounds, getDateFromXPositon };
