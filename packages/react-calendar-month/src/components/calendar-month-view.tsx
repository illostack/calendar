"use client";

import {
  CalendarContextMenu,
  CalendarView,
  addMonths,
  getMonthDays,
  mergeRefs,
  useCalendar
} from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
import * as React from "react";

import { useCalendarMonthInteraction } from "../hooks/use-calendar-month-interaction";
import { useCalendarMonthSelection } from "../hooks/use-calendar-month-selection";
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
  const calendar = useCalendar();
  const dates = calendar.useWatch((s) => s.dates);
  const selectionRef = useCalendarMonthSelection();
  const interactionRef = useCalendarMonthInteraction();

  return (
    <div
      ref={ref}
      className={cn("flex h-full flex-grow flex-col", className)}
      {...props}
    >
      <CalendarMonthHeader />
      <div className="relative flex h-0 flex-grow select-none flex-col">
        <CalendarMonthDndProvider>
          <CalendarContextMenu>
            <div
              ref={mergeRefs(selectionRef, interactionRef)}
              className="grid h-full w-full"
              style={{
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
          </CalendarContextMenu>
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
