"use client";

import {
  CalendarView,
  addMonths,
  formatDate,
  getMonthDays,
  mergeRefs,
  useCalendar
} from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
import * as React from "react";

import { useCalendarMonthInteraction } from "../hooks/use-calendar-month-interaction";
import { useCalendarMonthResize } from "../hooks/use-calendar-month-resize";
import { useCalendarMonthSelection } from "../hooks/use-calendar-month-selection";
import { CalendarMonthContextMenu } from "./calendar-month-context-menu";
import { CalendarMonthDay } from "./calendar-month-day";
import { CalendarMonthDndProvider } from "./calendar-month-dnd";
import { CalendarMonthDndOverlay } from "./calendar-month-dnd-overlay";
import { CalendarMonthHeader } from "./calendar-month-header";

interface CalendarMonthViewProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarMonthView = React.forwardRef<
  HTMLDivElement,
  CalendarMonthViewProps
>(({ className, ...props }, ref) => {
  const viewRef = React.useRef<HTMLDivElement>(null);
  const calendar = useCalendar();
  const dates = calendar.useWatch((s) => s.dates);
  const selectionRef = useCalendarMonthSelection();
  const resizeRef = useCalendarMonthResize();
  const interactionRef = useCalendarMonthInteraction();

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
          "duration-300"
        );
        const timeout = setTimeout(() => {
          view.classList.remove(
            "animate-in",
            "slide-in-from-right-1/4",
            "duration-300"
          );
        }, 300);

        return () => clearTimeout(timeout);
      }

      if (state.date < previousState.date) {
        view.classList.add(
          "animate-in",
          "slide-in-from-left-1/4",
          "duration-300"
        );
        const timeout = setTimeout(() => {
          view.classList.remove(
            "animate-in",
            "slide-in-from-left-1/4",
            "duration-300"
          );
        }, 300);

        return () => clearTimeout(timeout);
      }

      return;
    }
  );

  return (
    <div
      ref={mergeRefs(viewRef, ref)}
      className={cn("flex h-full flex-grow flex-col", className)}
      {...props}
    >
      <CalendarMonthHeader />
      <div className="relative flex h-0 flex-grow select-none flex-col">
        <CalendarMonthDndProvider>
          <CalendarMonthContextMenu>
            <div
              ref={mergeRefs(selectionRef, resizeRef, interactionRef)}
              style={{
                height: "100%",
                width: "100%",
                display: "grid",
                gridTemplateColumns: `repeat(7, 1fr)`,
                gridTemplateRows: `repeat(${dates.length / 7}, 1fr)`
              }}
            >
              {dates.map((day, index) => {
                return (
                  <CalendarMonthDay
                    key={index}
                    index={index}
                    date={day.date}
                    isOutside={day.isOutside}
                  />
                );
              })}
            </div>
          </CalendarMonthContextMenu>
          <CalendarMonthDndOverlay />
        </CalendarMonthDndProvider>
      </div>
    </div>
  );
});
CalendarMonthView.displayName = "CalendarMonthView";

const VIEW_ID = "month";
type CalendarMonthMeta = Record<string, unknown>;
type CalendarMonthConfiguration = Record<string, unknown>;

const view: CalendarView<
  typeof VIEW_ID,
  CalendarMonthMeta,
  CalendarMonthConfiguration
> = {
  id: VIEW_ID,
  content: CalendarMonthView,
  viewDatesFn(date, weekStartsOn) {
    return getMonthDays(date, true, weekStartsOn);
  },
  increaseFn(date) {
    return addMonths(date, 1);
  },
  decreaseFn(date) {
    return addMonths(date, -1);
  },
  meta: {},
  configure() {
    return this!;
  }
};

export { view as CalendarMonthView };
