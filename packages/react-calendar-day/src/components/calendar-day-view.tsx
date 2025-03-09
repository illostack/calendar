"use client";

import {
  CalendarContextMenu,
  CalendarTimeIndicator,
  CalendarView,
  addDays,
  mergeRefs,
  useCalendar
} from "@illostack/react-calendar";
import React from "react";

import { useCalendarDayInteraction } from "../hooks/use-calendar-day-interaction";
import { useCalendarDayResize } from "../hooks/use-calendar-day-resize";
import { useCalendarDaySelection } from "../hooks/use-calendar-day-selection";
import { CalendarDayAxis } from "./calendar-day-axis";
import { CalendarDayContent } from "./calendar-day-content";
import { CalendarDayDndProvider } from "./calendar-day-dnd";
import { CalendarDayDndOverlay } from "./calendar-day-dnd-overlay";
import { CalendarDayHeader } from "./calendar-day-header";

interface CalendarDayViewProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarDayView = React.forwardRef<HTMLDivElement, CalendarDayViewProps>(
  (props, ref) => {
    const calendar = useCalendar();
    const date = calendar.useWatch((s) => s.date);
    const { calendarHeight } = calendar.getLayout();
    const selectionRef = useCalendarDaySelection();
    const resizeRef = useCalendarDayResize();
    const interactionRef = useCalendarDayInteraction();

    return (
      <div ref={ref} {...props}>
        <CalendarDayHeader />
        <div
          className="relative h-full w-full pl-24"
          style={{
            height: calendarHeight
          }}
        >
          <CalendarDayAxis />
          <CalendarTimeIndicator />
          <CalendarDayDndProvider>
            <CalendarContextMenu>
              <div
                ref={mergeRefs(selectionRef, resizeRef, interactionRef)}
                className="relative grid h-full w-full grid-cols-1"
              >
                <CalendarDayContent date={date} />
              </div>
            </CalendarContextMenu>
            <CalendarDayDndOverlay />
          </CalendarDayDndProvider>
        </div>
      </div>
    );
  }
);
CalendarDayView.displayName = "CalendarDayView";

const VIEW_ID = "day";
type CalendarDayMeta = Record<string, unknown>;
type CalendarDayConfiguration = Record<string, unknown>;

const view: CalendarView<
  typeof VIEW_ID,
  CalendarDayMeta,
  CalendarDayConfiguration
> = {
  id: VIEW_ID,
  content: CalendarDayView,
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

export { view as CalendarDayView };
