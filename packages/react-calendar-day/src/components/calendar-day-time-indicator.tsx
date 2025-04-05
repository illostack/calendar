"use client";

import { isSameDay, useCalendar } from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
import * as React from "react";
import { useDayViewPosition } from "../hooks/use-day-view-position";

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

type CalendarDayTimeIndicatorProps = object;

const CalendarDayTimeIndicator = React.memo<CalendarDayTimeIndicatorProps>(
  () => {
    const lineRef = React.useRef<HTMLDivElement>(null);
    const currentDate = useCurrentDate();
    const calendar = useCalendar();
    const date = calendar.useWatch((s) => s.date);
    const formatters = calendar.getFormatters();
    const position = useDayViewPosition(currentDate, currentDate);

    const isCurrentDay = React.useMemo(
      () => isSameDay(currentDate, date),
      [currentDate, date]
    );

    return (
      <div
        ref={lineRef}
        title={formatters.time(new Date())}
        className={cn(
          "bg-primary before:bg-primary absolute right-0 z-0 h-0.5 w-[calc(100%+1rem)] before:absolute before:-left-1 before:top-1/2 before:z-0 before:h-2.5 before:w-2.5 before:-translate-y-1/2 before:rounded-full before:content-['']",
          !isCurrentDay && "opacity-20"
        )}
        style={{
          top: position.top
        }}
      />
    );
  }
);

CalendarDayTimeIndicator.displayName = "CalendarDayTimeIndicator";

export { CalendarDayTimeIndicator };
