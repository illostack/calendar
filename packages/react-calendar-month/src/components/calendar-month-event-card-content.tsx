"use client";

import { CalendarEvent, useCalendar } from "@illostack/react-calendar";
import { cn, cva, VariantProps } from "@illostack/react-calendar-ui";
import * as React from "react";

const calendarEventCardVariants = cva(
  "h-full w-full relative pointer-events-none flex-row gap-2 rounded-[var(--calendar-radius)] justify-between py-0.5 pl-4 pr-2 items-center overflow-hidden text-[0.7rem] before:absolute before:left-1.5 before:inset-y-1.5 before:w-1 before:rounded-lg [&_div:last-child]:flex-none [&_div:first-child]:flex-grow [&_div:first-child]:line-clamp-1 shadow-md ring-1 ring-foreground/5 flex overflow-hidden group-data-[event-state=active]:ring-2 group-data-[event-state=active]:ring-primary group-data-[event-state=active]:shadow-xl group-data-[event-state=active]:ring-offset-transparent select-none",
  {
    variants: {
      color: {
        green:
          "bg-green-300 dark:bg-green-700 before:bg-green-700 dark:before:bg-green-300 text-green-700 dark:text-green-200",
        blue: "bg-blue-300 dark:bg-blue-700 before:bg-blue-700 dark:before:bg-blue-300 text-blue-700 dark:text-blue-200",
        red: "bg-red-300 dark:bg-red-700 before:bg-red-700 dark:before:bg-red-300 text-red-700 dark:text-red-200",
        yellow:
          "bg-yellow-300 dark:bg-yellow-700 before:bg-yellow-700 dark:before:bg-yellow-300 text-yellow-700 dark:text-yellow-200",
        purple:
          "bg-purple-300 dark:bg-purple-700 before:bg-purple-700 dark:before:bg-purple-300 text-purple-700 dark:text-purple-200",
        pink: "bg-pink-300 dark:bg-pink-700 before:bg-pink-700 dark:before:bg-pink-300 text-pink-700 dark:text-pink-200",
        indigo:
          "bg-indigo-300 dark:bg-indigo-700 before:bg-indigo-700 dark:before:bg-indigo-300 text-indigo-700 dark:text-indigo-200",
        cyan: "bg-cyan-300 dark:bg-cyan-700 before:bg-cyan-700 dark:before:bg-cyan-300 text-cyan-700 dark:text-cyan-200"
      }
    },
    defaultVariants: {
      color: "blue"
    }
  }
);

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
