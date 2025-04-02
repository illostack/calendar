"use client";

import {
  DialogContainer,
  SheetContainer,
  Toaster
} from "@illostack/react-calendar-ui";
import * as React from "react";

import { useReactCalendar } from "../hooks/use-react-calendar";
import {
  CalendarApi,
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

  calendar.useActiveEventKeyboardEvents();

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

  calendar.useViewAnimation();
  calendar.useViewAutoScroll();

  return <currentView.content ref={calendar.viewRef} {...props} />;
});
CalendarContent.displayName = "CalendarContent";

export { Calendar, CalendarContent, useCalendar };
