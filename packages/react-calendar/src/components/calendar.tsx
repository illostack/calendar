"use client";

import {
  DialogContainer,
  SheetContainer,
  Toaster
} from "@illostack/react-calendar-ui";
import * as React from "react";

import { useReactCalendar } from "../hooks/use-react-calendar";
import { timeToPosition } from "../lib/position";
import { isDatesBetween } from "../lib/time";
import {
  CalendarApi,
  CalendarEvent,
  CalendarEventWithPosition,
  CalendarOptions,
  CalendarProvidedEvent,
  CalendarView,
  CalendarViewConfiguration,
  CalendarViewId,
  CalendarViewMeta
} from "../types";

const CalendarContext = React.createContext<
  CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
>(
  {} as CalendarApi<
    CalendarProvidedEvent,
    CalendarView<CalendarViewId, CalendarViewMeta, CalendarViewConfiguration>[]
  >
);
const useCalendar = () => {
  const context = React.useContext(CalendarContext);
  if (!context)
    throw new Error("useCalendar must be used within a CalendarContext");
  return context;
};

interface CalendarProviderProps<
  TEvent extends CalendarProvidedEvent,
  TViews extends CalendarView<
    CalendarViewId,
    CalendarViewMeta,
    CalendarViewConfiguration
  >[]
> extends CalendarOptions<TEvent, TViews> {
  toasterTheme?: "light" | "dark" | "system" | undefined;
  children?: React.ReactNode;
}

const DEFAULT_TOASTER_THEME = "system";

const CalendarProvider = <
  TEvent extends CalendarProvidedEvent,
  TViews extends CalendarView<
    CalendarViewId,
    CalendarViewMeta,
    CalendarViewConfiguration
  >[]
>({
  children,
  toasterTheme = DEFAULT_TOASTER_THEME,
  ...options
}: CalendarProviderProps<TEvent, TViews>) => {
  const calendar = useReactCalendar(options);

  calendar.useEffect(
    (state) => state.activeEvent,
    (s) => {
      if (s.activeEvent) {
        const handler = (e: KeyboardEvent) => {
          // Delete event
          if (e.key === "Delete") {
            e.preventDefault();
            calendar.removeEvent(s.activeEvent?.id!);
            return;
          }
          // Duplicate event
          if (e.key === "d" && e.ctrlKey) {
            e.preventDefault();
            calendar.duplicateEvent(s.activeEvent?.id!);
            calendar.clearActiveEvent();
            return;
          }
          // Copy event
          if (e.key === "c" && e.ctrlKey) {
            e.preventDefault();
            calendar.copyEvent(s.activeEvent?.id!);
            return;
          }
          // Cut event
          if (e.key === "x" && e.ctrlKey) {
            e.preventDefault();
            calendar.cutEvent(s.activeEvent?.id!);
            return;
          }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
      }

      return;
    }
  );

  return (
    <CalendarContext.Provider
      value={
        calendar as unknown as CalendarApi<
          CalendarProvidedEvent,
          CalendarView<
            TViews[number]["id"],
            TViews[number]["meta"],
            Parameters<TViews[number]["configure"]>[0]
          >[]
        >
      }
    >
      {children}
      <SheetContainer />
      <DialogContainer />
      <Toaster theme={toasterTheme} />
    </CalendarContext.Provider>
  );
};

CalendarProvider.displayName = "CalendarProvider";

const Calendar = <
  TEvent extends CalendarProvidedEvent,
  TViews extends CalendarView<
    CalendarViewId,
    CalendarViewMeta,
    CalendarViewConfiguration
  >[]
>(
  props: CalendarProviderProps<TEvent, TViews>
) => {
  return <CalendarProvider {...props} />;
};

interface CalendarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CalendarContent = React.memo<CalendarContentProps>((props) => {
  const calendar = useCalendar();
  const currentView = calendar.useWatch((s) => s.currentView);

  return <currentView.content {...props} />;
});
CalendarContent.displayName = "CalendarContent";

// =================== HOOKS ADICIONALES ===================

const useCalendarPosition = (date: Date, startAt: Date, endAt: Date) => {
  const calendar = useCalendar();

  return React.useMemo(() => {
    const { top, height } = timeToPosition(date, startAt, endAt, calendar);

    return { top, height, left: 0, right: 0 };
  }, [startAt, endAt, date, calendar]);
};

const useIsInDate = (date: Date, startAt?: Date, endAt?: Date) => {
  const calendar = useCalendar();
  const { startHour, endHour } = calendar.getLayout();

  if (!startAt || !endAt) {
    return false;
  }

  return isDatesBetween(
    new Date(date.setHours(startHour, 0, 0, 0)),
    new Date(date.setHours(endHour, 0, 0, 0)),
    startAt,
    endAt
  );
};

const useViewEvents = (date: Date) => {
  const calendar = useCalendar();
  const { startHour, endHour } = calendar.getLayout();
  return calendar.useWatch((s) =>
    s.events.filter((event) =>
      isDatesBetween(
        new Date(date.setHours(startHour, 0, 0, 0)),
        new Date(date.setHours(endHour, 0, 0, 0)),
        event.startAt,
        event.endAt
      )
    )
  );
};

const useEventsWithPosition = (date: Date, events: CalendarEvent[]) => {
  const calendar = useCalendar();

  return React.useMemo(
    () =>
      events.reduce<CalendarEventWithPosition[]>((acc, event) => {
        const { top, height } = timeToPosition(
          date,
          event.startAt,
          event.endAt,
          calendar
        );

        const prevEvent = acc[acc.length - 1];

        // I think this is one of the most efficient ways to calculate the overlap
        // and the left position of an event
        if (
          prevEvent &&
          top < prevEvent.top + prevEvent.height &&
          top + height > prevEvent.top
        ) {
          const overlap = prevEvent.overlap + 1;
          const left = overlap * (100 / (overlap + 2)) + "%";

          return [
            ...acc,
            {
              ...event,
              top,
              height,
              overlap,
              left,
              right: 0,
              position: "absolute"
            }
          ];
        }

        return [
          ...acc,
          {
            ...event,
            top,
            height,
            overlap: 0,
            left: 0,
            right: 0,
            position: "absolute"
          }
        ];
      }, []),
    [date, events, calendar]
  );
};

const useIsCuttedEvent = (event: CalendarEvent) => {
  const calendar = useCalendar();
  return calendar.useWatch((s) => s.cuttedEvent?.id === event.id);
};

const useIsDraggingEvent = (event: CalendarEvent) => {
  const calendar = useCalendar();
  return calendar.useWatch((s) => s.draggingEvent?.id === event.id);
};

const useIsResizingEvent = (event: CalendarEvent) => {
  const calendar = useCalendar();
  return calendar.useWatch((s) => s.resizingEvent?.id === event.id);
};

const useIsActiveEvent = (event: CalendarEvent) => {
  const calendar = useCalendar();
  return calendar.useWatch((s) => s.activeEvent?.id === event.id);
};

const useCurrentDate = () => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  return currentDate;
};

export {
  Calendar,
  CalendarContent,
  useCalendar,
  useCalendarPosition,
  useCurrentDate,
  useEventsWithPosition,
  useIsActiveEvent,
  useIsCuttedEvent,
  useIsDraggingEvent,
  useIsInDate,
  useIsResizingEvent,
  useViewEvents
};
