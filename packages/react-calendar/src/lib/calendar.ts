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

export const CALENDAR_TRANSLATIONS: CalendarTranslations = {
  calendar: {
    days: {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday"
    },
    months: {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December"
    }
  },
  literals: {
    day: "Day",
    days: "Days",
    week: "Week",
    month: "Month",
    year: "Year",
    today: "Today",
    previous: "Previous",
    next: "Next",
    range: "Range",
    more: "More",
    "go-to": "Go to"
  },
  form: { save: "Save" },
  action: {
    "create-event": "Create Event",
    "update-event": "Update Event",
    "delete-event": "Delete Event",
    "duplicate-event": "Duplicate Event",
    "copy-event": "Copy Event",
    "cut-event": "Cut Event",
    "paste-event": "Paste Event",
    undo: "Undo"
  },
  message: {
    "event-created": "Event created",
    "event-updated": "Event updated",
    "event-deleted": "Event deleted",
    "event-restored": "Event restored",
    "event-duplicated": "Event duplicated",
    "event-copied": "Event copied",
    "event-cutted": "Event cutted",
    "event-pasted": "Event pasted",
    "event-not-found": "Event not found"
  }
};

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
      0:
        translations.calendar?.days?.[0] ||
        CALENDAR_TRANSLATIONS.calendar.days[0],
      1:
        translations.calendar?.days?.[1] ||
        CALENDAR_TRANSLATIONS.calendar.days[1],
      2:
        translations.calendar?.days?.[2] ||
        CALENDAR_TRANSLATIONS.calendar.days[2],
      3:
        translations.calendar?.days?.[3] ||
        CALENDAR_TRANSLATIONS.calendar.days[3],
      4:
        translations.calendar?.days?.[4] ||
        CALENDAR_TRANSLATIONS.calendar.days[4],
      5:
        translations.calendar?.days?.[5] ||
        CALENDAR_TRANSLATIONS.calendar.days[5],
      6:
        translations.calendar?.days?.[6] ||
        CALENDAR_TRANSLATIONS.calendar.days[6]
    },
    months: {
      0:
        translations.calendar?.months?.[0] ||
        CALENDAR_TRANSLATIONS.calendar.months[0],
      1:
        translations.calendar?.months?.[1] ||
        CALENDAR_TRANSLATIONS.calendar.months[1],
      2:
        translations.calendar?.months?.[2] ||
        CALENDAR_TRANSLATIONS.calendar.months[2],
      3:
        translations.calendar?.months?.[3] ||
        CALENDAR_TRANSLATIONS.calendar.months[3],
      4:
        translations.calendar?.months?.[4] ||
        CALENDAR_TRANSLATIONS.calendar.months[4],
      5:
        translations.calendar?.months?.[5] ||
        CALENDAR_TRANSLATIONS.calendar.months[5],
      6:
        translations.calendar?.months?.[6] ||
        CALENDAR_TRANSLATIONS.calendar.months[6],
      7:
        translations.calendar?.months?.[7] ||
        CALENDAR_TRANSLATIONS.calendar.months[7],
      8:
        translations.calendar?.months?.[8] ||
        CALENDAR_TRANSLATIONS.calendar.months[8],
      9:
        translations.calendar?.months?.[9] ||
        CALENDAR_TRANSLATIONS.calendar.months[9],
      10:
        translations.calendar?.months?.[10] ||
        CALENDAR_TRANSLATIONS.calendar.months[10],
      11:
        translations.calendar?.months?.[11] ||
        CALENDAR_TRANSLATIONS.calendar.months[11]
    }
  },
  literals: {
    day: translations.literals?.day || CALENDAR_TRANSLATIONS.literals.day,
    days: translations.literals?.days || CALENDAR_TRANSLATIONS.literals.days,
    week: translations.literals?.week || CALENDAR_TRANSLATIONS.literals.week,
    month: translations.literals?.month || CALENDAR_TRANSLATIONS.literals.month,
    year: translations.literals?.year || CALENDAR_TRANSLATIONS.literals.year,
    today: translations.literals?.today || CALENDAR_TRANSLATIONS.literals.today,
    previous:
      translations.literals?.previous ||
      CALENDAR_TRANSLATIONS.literals.previous,
    next: translations.literals?.next || CALENDAR_TRANSLATIONS.literals.next,
    range: translations.literals?.range || CALENDAR_TRANSLATIONS.literals.range,
    more: translations.literals?.more || CALENDAR_TRANSLATIONS.literals.more,
    "go-to":
      translations.literals?.["go-to"] ||
      CALENDAR_TRANSLATIONS.literals["go-to"]
  },
  form: { save: translations.form?.save || CALENDAR_TRANSLATIONS.form.save },
  action: {
    "create-event":
      translations.action?.["create-event"] ||
      CALENDAR_TRANSLATIONS.action["create-event"],
    "update-event":
      translations.action?.["update-event"] ||
      CALENDAR_TRANSLATIONS.action["update-event"],
    "delete-event":
      translations.action?.["delete-event"] ||
      CALENDAR_TRANSLATIONS.action["delete-event"],
    "duplicate-event":
      translations.action?.["duplicate-event"] ||
      CALENDAR_TRANSLATIONS.action["duplicate-event"],
    "copy-event":
      translations.action?.["copy-event"] ||
      CALENDAR_TRANSLATIONS.action["copy-event"],
    "cut-event":
      translations.action?.["cut-event"] ||
      CALENDAR_TRANSLATIONS.action["cut-event"],
    "paste-event":
      translations.action?.["paste-event"] ||
      CALENDAR_TRANSLATIONS.action["paste-event"],
    undo: translations.action?.["undo"] || CALENDAR_TRANSLATIONS.action.undo
  },
  message: {
    "event-created":
      translations.message?.["event-created"] ||
      CALENDAR_TRANSLATIONS.message["event-created"],
    "event-updated":
      translations.message?.["event-updated"] ||
      CALENDAR_TRANSLATIONS.message["event-updated"],
    "event-deleted":
      translations.message?.["event-deleted"] ||
      CALENDAR_TRANSLATIONS.message["event-deleted"],
    "event-restored":
      translations.message?.["event-restored"] ||
      CALENDAR_TRANSLATIONS.message["event-restored"],
    "event-duplicated":
      translations.message?.["event-duplicated"] ||
      CALENDAR_TRANSLATIONS.message["event-duplicated"],
    "event-copied":
      translations.message?.["event-copied"] ||
      CALENDAR_TRANSLATIONS.message["event-copied"],
    "event-cutted":
      translations.message?.["event-cutted"] ||
      CALENDAR_TRANSLATIONS.message["event-cutted"],
    "event-pasted":
      translations.message?.["event-pasted"] ||
      CALENDAR_TRANSLATIONS.message["event-pasted"],
    "event-not-found":
      translations.message?.["event-not-found"] ||
      CALENDAR_TRANSLATIONS.message["event-not-found"]
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
  endHour,
  disableAnimation
}: {
  rowHeight: number;
  minutesPerRow: number;
  startHour: CalendarHours;
  endHour: CalendarHours;
  disableAnimation: boolean;
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
    hours,
    disableAnimation
  };
};

export const createCalendarView = <
  TView extends CalendarViewId,
  TViewMeta extends CalendarViewMeta,
  TViewConfiguration extends CalendarViewConfiguration
>(
  options: CalendarView<TView, TViewMeta, TViewConfiguration>
): CalendarView<TView, TViewMeta, TViewConfiguration> => {
  // Include generic view options if needed ...

  return options;
};
