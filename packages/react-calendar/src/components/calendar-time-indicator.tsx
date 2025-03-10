"use client";

import { cn } from "@illostack/react-calendar-ui";
import * as React from "react";

import { isSameDay } from "../lib/time";
import { useCalendar, useCurrentDate } from "./calendar";

type CalendarTimeIndicatorProps = object;

const CalendarTimeIndicator = React.memo<CalendarTimeIndicatorProps>(() => {
  const lineRef = React.useRef<HTMLDivElement>(null);
  const currentDate = useCurrentDate();
  const calendar = useCalendar();
  const date = calendar.useWatch((s) => s.date);
  const formatters = calendar.getFormatters();
  const { rowHeight, minutesPerRow, startHour, endHour } = calendar.getLayout();

  const currentPosition = React.useMemo(() => {
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    if (currentHour < startHour || currentHour >= endHour) {
      return null;
    }

    return (
      currentHour * 60 +
      currentMinutes -
      ((startHour === 0 ? 1 : startHour) - 1) * 60
    );
  }, [currentDate, endHour, startHour]);

  const isCurrentDay = React.useMemo(
    () => isSameDay(currentDate, date),
    [currentDate, date]
  );

  if (currentPosition === null) {
    return null;
  }

  return (
    <div className="relative">
      <div
        ref={lineRef}
        title={formatters.time(new Date())}
        className={cn(
          "bg-primary before:bg-primary absolute inset-x-0 z-0 -ml-4 -mr-4 h-0.5 w-full before:absolute before:-left-1 before:top-1/2 before:z-0 before:h-2.5 before:w-2.5 before:-translate-y-1/2 before:rounded-full before:content-['']",
          !isCurrentDay && "opacity-20"
        )}
        style={{
          top: `${currentPosition * (rowHeight / minutesPerRow)}px`
        }}
      />
    </div>
  );
});

CalendarTimeIndicator.displayName = "CalendarTimeIndicator";

export { CalendarTimeIndicator };
