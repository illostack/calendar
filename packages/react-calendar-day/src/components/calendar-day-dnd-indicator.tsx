"use client";

import {
  CalendarEvent,
  useCalendar,
  useCalendarPosition,
  useIsInDate
} from "@illostack/react-calendar";
import * as React from "react";

interface CalendarDayDndIndicatorContentProps {
  draggingEvent: CalendarEvent;
  date: Date;
}

const CalendarDayDndIndicatorContent =
  React.memo<CalendarDayDndIndicatorContentProps>(({ draggingEvent, date }) => {
    const { top, height, left, right } = useCalendarPosition(
      date,
      draggingEvent.startAt,
      draggingEvent.endAt
    );

    return (
      <div
        className="border-foreground rounded-sm border-2"
        style={{
          position: "absolute",
          zIndex: 1,
          top,
          left,
          right,
          height,
          pointerEvents: "none"
        }}
      />
    );
  });
CalendarDayDndIndicatorContent.displayName = "CalendarDayDndIndicatorContent";

interface CalendarDayDndIndicatorProps {
  date: Date;
}

const CalendarDayDndIndicator = React.memo<CalendarDayDndIndicatorProps>(
  ({ date }) => {
    const calendar = useCalendar();
    const draggingEvent = calendar.useWatch((s) => s.draggingEvent);
    const isInDate = useIsInDate(
      date,
      draggingEvent?.startAt,
      draggingEvent?.endAt
    );

    if (!draggingEvent || !isInDate) {
      return null;
    }

    return (
      <CalendarDayDndIndicatorContent
        draggingEvent={draggingEvent}
        date={date}
      />
    );
  }
);
CalendarDayDndIndicator.displayName = "CalendarDayDndIndicator";

export { CalendarDayDndIndicator };
