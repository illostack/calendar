"use client";

import {
  CalendarEvent,
  isDateBetween,
  useCalendar
} from "@illostack/react-calendar";
import * as React from "react";

interface CalendarMonthDndIndicatorContentProps {
  draggingEvent: CalendarEvent;
  date: Date;
}

const CalendarMonthDndIndicatorContent =
  React.memo<CalendarMonthDndIndicatorContentProps>(
    ({ draggingEvent, date }) => {
      const isSameDate = React.useMemo(
        () => isDateBetween(date, draggingEvent.startAt, draggingEvent.endAt),
        [date, draggingEvent]
      );

      if (!isSameDate) return null;

      return (
        <div
          className="rounded-sm border-2"
          style={{
            position: "absolute",
            zIndex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            pointerEvents: "none",
            borderColor: "hsl(var(--calendar-primary))"
          }}
        />
      );
    }
  );
CalendarMonthDndIndicatorContent.displayName =
  "CalendarMonthDndIndicatorContent";

interface CalendarMonthDndIndicatorProps {
  date: Date;
}

const CalendarMonthDndIndicator = React.memo<CalendarMonthDndIndicatorProps>(
  ({ date }) => {
    const calendar = useCalendar();
    const draggingEvent = calendar.useWatch((s) => s.draggingEvent);

    if (!draggingEvent) return null;

    return (
      <CalendarMonthDndIndicatorContent
        draggingEvent={draggingEvent}
        date={date}
      />
    );
  }
);
CalendarMonthDndIndicator.displayName = "CalendarMonthDndIndicator";

export { CalendarMonthDndIndicator };
