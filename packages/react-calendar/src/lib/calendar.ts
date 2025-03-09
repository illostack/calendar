import {
  CalendarEvent,
  CalendarHours,
  CalendarProvidedEvent,
  CalendarState,
  CalendarTranslations,
  CalendarView,
  CalendarViewConfiguration,
  CalendarViewId,
  CalendarViewMeta
} from "../types";

export const CALENDAR_COLORS = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "pink",
  "indigo",
  "cyan"
] as const;

export const sortEvents = <TEvent extends CalendarProvidedEvent>(
  events: CalendarEvent<TEvent>[]
): CalendarEvent<TEvent>[] => {
  return events.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
};

export const normalizeDate = (
  date: string | Date | { dateTime: string; timeZone: string }
): Date => {
  if (typeof date === "string") {
    return new Date(date);
  }
  if (date instanceof Date) {
    return date;
  }
  return new Date(date.dateTime);
};

export const normalizeEvents = <TEvent extends CalendarProvidedEvent>(
  events: TEvent[]
): CalendarEvent<TEvent>[] =>
  sortEvents(
    events.map((event) => ({
      ...event,
      startAt: normalizeDate(event.startAt),
      endAt: normalizeDate(event.endAt),
      color: event.color ?? "blue"
    }))
  );

export const resolveTranslations = (
  translations: Partial<CalendarTranslations>
): CalendarTranslations => ({
  calendar: {
    days: {
      0: translations.calendar?.days?.[0] || "Sunday",
      1: translations.calendar?.days?.[1] || "Monday",
      2: translations.calendar?.days?.[2] || "Tuesday",
      3: translations.calendar?.days?.[3] || "Wednesday",
      4: translations.calendar?.days?.[4] || "Thursday",
      5: translations.calendar?.days?.[5] || "Friday",
      6: translations.calendar?.days?.[6] || "Saturday"
    },
    months: {
      0: translations.calendar?.months?.[0] || "January",
      1: translations.calendar?.months?.[1] || "February",
      2: translations.calendar?.months?.[2] || "March",
      3: translations.calendar?.months?.[3] || "April",
      4: translations.calendar?.months?.[4] || "May",
      5: translations.calendar?.months?.[5] || "June",
      6: translations.calendar?.months?.[6] || "July",
      7: translations.calendar?.months?.[7] || "August",
      8: translations.calendar?.months?.[8] || "September",
      9: translations.calendar?.months?.[9] || "October",
      10: translations.calendar?.months?.[10] || "November",
      11: translations.calendar?.months?.[11] || "December"
    }
  },
  literals: {
    day: translations.literals?.day || "Day",
    days: translations.literals?.days || "Days",
    week: translations.literals?.week || "Week",
    month: translations.literals?.month || "Month",
    year: translations.literals?.year || "Year",
    today: translations.literals?.today || "Today",
    previous: translations.literals?.previous || "Previous",
    next: translations.literals?.next || "Next",
    range: translations.literals?.range || "Range",
    more: translations.literals?.more || "More"
  },
  form: { save: translations.form?.save || "Save" },
  action: {
    "create-event": translations.action?.["create-event"] || "Create Event",
    "update-event": translations.action?.["update-event"] || "Update Event",
    "delete-event": translations.action?.["delete-event"] || "Delete Event",
    "duplicate-event":
      translations.action?.["duplicate-event"] || "Duplicate Event",
    "copy-event": translations.action?.["copy-event"] || "Copy Event",
    "cut-event": translations.action?.["cut-event"] || "Cut Event",
    "paste-event": translations.action?.["paste-event"] || "Paste Event",
    undo: translations.action?.["undo"] || "Undo"
  },
  message: {
    "event-created": translations.message?.["event-created"] || "Event created",
    "event-updated": translations.message?.["event-updated"] || "Event updated",
    "event-deleted": translations.message?.["event-deleted"] || "Event deleted",
    "event-restored":
      translations.message?.["event-restored"] || "Event restored",
    "event-duplicated":
      translations.message?.["event-duplicated"] || "Event duplicated",
    "event-copied": translations.message?.["event-copied"] || "Event copied",
    "event-cutted": translations.message?.["event-cutted"] || "Event cutted",
    "event-pasted": translations.message?.["event-pasted"] || "Event pasted",
    "event-not-found":
      translations.message?.["event-not-found"] || "Event not found"
  }
});

export const resolveFormatters = (
  formatters: Partial<
    CalendarState<
      CalendarProvidedEvent,
      CalendarView<
        CalendarViewId,
        CalendarViewMeta,
        CalendarViewConfiguration
      >[]
    >["formatters"]
  >,
  locale: string
): CalendarState<
  CalendarProvidedEvent,
  CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
>["formatters"] => ({
  time:
    formatters.time ||
    ((date: Date) =>
      Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "numeric"
      }).format(date)),
  date:
    formatters.date ||
    ((date: Date) =>
      Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(date)),
  dateTime:
    formatters.dateTime ||
    ((date: Date) =>
      Intl.DateTimeFormat(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      }).format(date)),
  week:
    formatters.week ||
    ((date: Date) =>
      Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        date
      )),
  month:
    formatters.month ||
    ((date: Date) =>
      Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        date
      )),
  year:
    formatters.year ||
    ((date: Date) =>
      Intl.DateTimeFormat(locale, { year: "numeric" }).format(date)),
  weekDayName:
    formatters.weekDayName ||
    ((date: Date) =>
      Intl.DateTimeFormat(locale, { weekday: "short" }).format(date)),
  weekDay:
    formatters.weekDay ||
    ((date: Date) =>
      Intl.DateTimeFormat(locale, { day: "numeric" }).format(date)),
  monthDay:
    formatters.monthDay ||
    ((date: Date) =>
      Intl.DateTimeFormat(locale, { day: "numeric" }).format(date)),
  range:
    formatters.range ||
    ((start: Date, end: Date) =>
      `${Intl.DateTimeFormat(locale, { month: "long", day: "numeric" }).format(
        start
      )} - ${Intl.DateTimeFormat(locale, {
        month: "long",
        day: "numeric"
      }).format(end)}`)
});

export const getModifierKeyPrefix = () =>
  typeof window === "undefined"
    ? "Ctrl"
    : navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
      ? "⌘"
      : "Ctrl";

export const getCalendarHours = (
  startHour: CalendarHours,
  endHour: CalendarHours,
  endOffset: number
) => {
  const hours = [];
  for (let i = startHour; i < endHour + endOffset; i++) {
    hours.push(i);
  }
  return hours;
};

export const resolveLayout = ({
  rowHeight,
  minutesPerRow,
  startHour,
  endHour
}: {
  rowHeight: number;
  minutesPerRow: number;
  startHour: CalendarHours;
  endHour: CalendarHours;
}) => {
  const endOffset = 1;
  const rowsPerHour = 60 / minutesPerRow;
  const totalRows = (endHour - startHour + endOffset) * rowsPerHour;
  const calendarHeight = totalRows * rowHeight;
  const hours = getCalendarHours(startHour, endHour, endOffset);

  return {
    rowHeight,
    minutesPerRow,
    rowsPerHour,
    totalRows,
    startHour,
    endHour,
    calendarHeight,
    endOffset,
    hours
  };
};
