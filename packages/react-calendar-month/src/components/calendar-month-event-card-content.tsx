"use client";

import { CalendarEvent, useCalendar } from "@illostack/react-calendar";
import {
  calendarEventCardVariants,
  cn,
  VariantProps
} from "@illostack/react-calendar-ui";
import * as React from "react";

interface CalendarMonthEventCardContentProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof calendarEventCardVariants>, "color"> {
  event: CalendarEvent;
}

const CalendarMonthEventCardContent = React.forwardRef<
  HTMLDivElement,
  CalendarMonthEventCardContentProps
>(({ event, className, ...props }, ref) => {
  const calendar = useCalendar();
  const formatters = calendar.getFormatters();

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none relative flex h-full w-full select-none flex-row items-center justify-between gap-2 overflow-hidden rounded-[calc(var(--calendar-radius)*0.5)] p-2 text-[0.7rem] shadow-md [&_div:first-child]:line-clamp-1 [&_div:first-child]:flex-grow [&_div:last-child]:flex-none",
        calendarEventCardVariants({
          color: event.color,
          className
        })
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <h3 className="font-semibold leading-tight">
          {event.summary || "(Untitled)"}
        </h3>
      </div>
      <div>
        <p className="text-[.6rem] leading-tight">
          {formatters.time(event.startAt)} - {formatters.time(event.endAt)}
        </p>
      </div>
    </div>
  );
});
CalendarMonthEventCardContent.displayName = "CalendarMonthEventCardContent";

export { CalendarMonthEventCardContent };
