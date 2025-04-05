"use client";

import {
  addMonths,
  createCalendarView,
  getMonthDays,
  mergeRefs,
  useCalendar
} from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
import * as React from "react";

import { useCalendarMonthDrag } from "../hooks/use-calendar-month-drag";
import { useCalendarMonthInteraction } from "../hooks/use-calendar-month-interaction";
import { useCalendarMonthResize } from "../hooks/use-calendar-month-resize";
import { useCalendarMonthSelection } from "../hooks/use-calendar-month-selection";
import { CalendarMonthActiveDrag } from "./calendar-month-active-drag";
import { CalendarMonthActiveResize } from "./calendar-month-active-resize";
import { CalendarMonthActiveSection } from "./calendar-month-active-section";
import { CalendarMonthActiveSelection } from "./calendar-month-active-selection";
import { CalendarMonthContextMenu } from "./calendar-month-context-menu";
import { CalendarMonthDay } from "./calendar-month-day";
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
  const resizeRef = useCalendarMonthResize();
  const interactionRef = useCalendarMonthInteraction();
  const dragRef = useCalendarMonthDrag();

  calendar.useViewAnimation();

  return (
    <div
      ref={ref}
      className={cn("flex h-full flex-grow flex-col", className)}
      {...props}
    >
      <CalendarMonthHeader />
      <div className="relative flex h-0 flex-grow select-none flex-col">
        <CalendarMonthContextMenu>
          <div
            className="relative grid h-full w-full grid-cols-7 overflow-hidden"
            ref={mergeRefs(selectionRef, resizeRef, interactionRef, dragRef)}
            style={{
              gridTemplateRows: `repeat(${dates.length / 7}, 1fr)`
            }}
          >
            <CalendarMonthActiveSection />
            <CalendarMonthActiveSelection />
            {dates.map((day, index) => {
              return (
                <CalendarMonthDay
                  key={index}
                  date={day.date}
                  isOutside={day.isOutside}
                />
              );
            })}
            <CalendarMonthActiveResize />
            <CalendarMonthActiveDrag />
          </div>
        </CalendarMonthContextMenu>
      </div>
    </div>
  );
});
CalendarMonthView.displayName = "CalendarMonthView";

const VIEW_ID = "month";
type CalendarMonthMeta = Record<string, unknown>;
type CalendarMonthConfiguration = Record<string, unknown>;

const view = createCalendarView<
  typeof VIEW_ID,
  CalendarMonthMeta,
  CalendarMonthConfiguration
>({
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
});

export { view as CalendarMonthView };
