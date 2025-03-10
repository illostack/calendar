"use client";

import {
  CalendarTimeIndicator,
  CalendarView,
  addDays,
  formatDate,
  mergeRefs,
  useCalendar
} from "@illostack/react-calendar";
import React from "react";

import { useCalendarDayInteraction } from "../hooks/use-calendar-day-interaction";
import { useCalendarDayResize } from "../hooks/use-calendar-day-resize";
import { useCalendarDaySelection } from "../hooks/use-calendar-day-selection";
import { CalendarDayAxis } from "./calendar-day-axis";
import { CalendarDayContent } from "./calendar-day-content";
import { CalendarDayContextMenu } from "./calendar-day-context-menu";
import { CalendarDayDndProvider } from "./calendar-day-dnd";
import { CalendarDayDndOverlay } from "./calendar-day-dnd-overlay";
import { CalendarDayHeader } from "./calendar-day-header";

interface CalendarDayViewProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarDaysViewTemplate = React.forwardRef<
  HTMLDivElement,
  CalendarDayViewProps
>((props, ref) => {
  const viewRef = React.useRef<HTMLDivElement>(null);
  const calendar = useCalendar();
  const dates = calendar.useWatch((s) => s.dates);
  const selectionRef = useCalendarDaySelection();
  const resizeRef = useCalendarDayResize();
  const interactionRef = useCalendarDayInteraction();

  calendar.useEffect(
    (s) => s.date,
    (state, previousState) => {
      const view = viewRef.current;

      if (!view) {
        return;
      }

      if (formatDate(state.date) === formatDate(previousState.date)) {
        return;
      }

      if (state.date > previousState.date) {
        view.classList.add(
          "animate-in",
          "slide-in-from-right-1/4",
          "fade-in",
          "duration-300"
        );
        const timeout = setTimeout(() => {
          view.classList.remove(
            "animate-in",
            "slide-in-from-right-1/4",
            "fade-in",
            "duration-300"
          );
        }, 300);

        return () => clearTimeout(timeout);
      }

      if (state.date < previousState.date) {
        view.classList.add(
          "animate-in",
          "slide-in-from-left-1/4",
          "fade-in",
          "duration-300"
        );
        const timeout = setTimeout(() => {
          view.classList.remove(
            "animate-in",
            "slide-in-from-left-1/4",
            "fade-in",
            "duration-300"
          );
        }, 300);

        return () => clearTimeout(timeout);
      }

      return;
    }
  );

  return (
    <div ref={mergeRefs(viewRef, ref)} {...props}>
      <CalendarDayHeader dates={dates} />
      <div
        style={{
          height: calendar.getLayout().calendarHeight,
          width: "100%",
          position: "relative",
          userSelect: "none",
          paddingLeft: "5rem"
        }}
      >
        <CalendarDayAxis dates={dates} />
        <CalendarTimeIndicator />
        <CalendarDayDndProvider>
          <CalendarDayContextMenu>
            <div
              ref={mergeRefs(selectionRef, resizeRef, interactionRef)}
              style={{
                height: "100%",
                width: "100%",
                position: "relative",
                display: "grid",
                gridTemplateColumns: `repeat(${dates.length}, 1fr)`
              }}
            >
              {dates.map(({ date }, index) => (
                <CalendarDayContent key={index} date={date} />
              ))}
            </div>
          </CalendarDayContextMenu>
          <CalendarDayDndOverlay />
        </CalendarDayDndProvider>
      </div>
    </div>
  );
});
CalendarDaysViewTemplate.displayName = "CalendarDaysViewTemplate";

const VIEW_ID = "day";
type CalendarDayMeta = Record<string, unknown>;
type CalendarDayConfiguration = Record<string, unknown>;

const view: CalendarView<
  typeof VIEW_ID,
  CalendarDayMeta,
  CalendarDayConfiguration
> = {
  id: VIEW_ID,
  content: CalendarDaysViewTemplate,
  viewDatesFn(date) {
    return [{ date: date, isOutside: false }];
  },
  increaseFn(date) {
    return addDays(date, 1);
  },
  decreaseFn(date) {
    return addDays(date, -1);
  },
  meta: {},
  configure() {
    return this!;
  }
};

export { view as CalendarDayView, CalendarDaysViewTemplate };
