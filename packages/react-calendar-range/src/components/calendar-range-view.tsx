"use client";

import {
  CalendarContextMenu,
  CalendarTimeIndicator,
  CalendarView,
  addDays,
  getRangeDays,
  mergeRefs,
  useCalendar
} from "@illostack/react-calendar";
import {
  CalendarDayContent,
  CalendarDayDndOverlay,
  CalendarDayDndProvider,
  useCalendarDayInteraction,
  useCalendarDayResize,
  useCalendarDaySelection
} from "@illostack/react-calendar-day";
import * as React from "react";

import { CalendarRangeAxis } from "./calendar-range-axis";
import { CalendarRangeHeader } from "./calendar-range-header";

interface CalendarRangeViewProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarRangeView = React.forwardRef<
  HTMLDivElement,
  CalendarRangeViewProps
>((props, ref) => {
  const calendar = useCalendar();
  const dates = calendar.useWatch((s) => s.dates);
  const selectionRef = useCalendarDaySelection();
  const resizeRef = useCalendarDayResize();
  const interactionRef = useCalendarDayInteraction();

  const { calendarHeight } = calendar.getLayout();

  return (
    <div ref={ref} {...props}>
      <CalendarRangeHeader />
      <div
        className="relative h-full select-none pl-20"
        style={{
          height: calendarHeight
        }}
      >
        <CalendarRangeAxis />
        <CalendarTimeIndicator />
        <CalendarDayDndProvider>
          <CalendarContextMenu>
            <div
              ref={mergeRefs(selectionRef, resizeRef, interactionRef)}
              className="relative grid h-full w-full"
              style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
            >
              {dates.map(({ date }, index) => (
                <CalendarDayContent key={index} date={date} />
              ))}
            </div>
          </CalendarContextMenu>
          <CalendarDayDndOverlay />
        </CalendarDayDndProvider>
      </div>
    </div>
  );
});
CalendarRangeView.displayName = "CalendarRangeView";

const VIEW_ID = "range";
type CalendarRangeMeta = {
  days: number;
};
type CalendarRangeConfiguration = {
  days?: number;
};

const view: CalendarView<
  typeof VIEW_ID,
  CalendarRangeMeta,
  CalendarRangeConfiguration
> = {
  id: VIEW_ID,
  content: CalendarRangeView,
  viewDatesFn(date) {
    return getRangeDays(date, this.meta.days).map((date) => ({
      date,
      isOutside: false
    }));
  },
  increaseFn(date) {
    return addDays(date, this.meta.days);
  },
  decreaseFn(date) {
    return addDays(date, -this.meta.days);
  },
  meta: {
    days: 1
  },
  configure({ days = 1 }) {
    this.meta.days = days;
    return this;
  }
};

export { view as CalendarRangeView };
