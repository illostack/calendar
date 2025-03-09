"use client";

import {
  addWeeks,
  CalendarContextMenu,
  CalendarTimeIndicator,
  CalendarView,
  getWeekDays,
  mergeRefs,
  useCalendar
} from "@illostack/react-calendar";
import {
  CalendarDayContent,
  CalendarDayDndOverlay,
  CalendarDayDndProvider,
  useCalendarDayActivator,
  useCalendarDayResize,
  useCalendarDaySelection
} from "@illostack/react-calendar-day";
import * as React from "react";

import { CalendarWeekAxis } from "./calendar-week-axis";
import { CalendarWeekHeader } from "./calendar-week-header";

interface CalendarWeekViewProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CalendarWeekView = React.forwardRef<
  HTMLDivElement,
  CalendarWeekViewProps
>((props, ref) => {
  const calendar = useCalendar();
  const dates = calendar.useWatch((s) => s.dates);
  const selectionPanel = useCalendarDaySelection();
  const resizePanel = useCalendarDayResize();
  const sectionPanel = useCalendarDayActivator();

  return (
    <div ref={ref} {...props}>
      <CalendarWeekHeader />
      <div
        className="relative h-full pl-24"
        style={{
          height: calendar.getLayout().calendarHeight
        }}
      >
        <CalendarWeekAxis />
        <CalendarTimeIndicator />
        <CalendarDayDndProvider>
          <CalendarContextMenu>
            <div
              ref={mergeRefs(selectionPanel, resizePanel, sectionPanel)}
              className="relative grid h-full w-full grid-cols-7"
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

CalendarWeekView.displayName = "CalendarWeekView";

const VIEW_ID = "week";
type CalendarWeekMeta = Record<string, unknown>;
type CalendarWeekConfiguration = Record<string, unknown>;

const view: CalendarView<
  typeof VIEW_ID,
  CalendarWeekMeta,
  CalendarWeekConfiguration
> = {
  id: VIEW_ID,
  content: CalendarWeekView,
  viewDatesFn(date, weekStartsOn) {
    return getWeekDays(date, weekStartsOn).map((date) => ({
      date,
      isOutside: false
    }));
  },
  increaseFn(date) {
    return addWeeks(date, 1);
  },
  decreaseFn(date) {
    return addWeeks(date, -1);
  },
  meta: {},
  configure() {
    return this!;
  }
};

export { view as CalendarWeekView };
