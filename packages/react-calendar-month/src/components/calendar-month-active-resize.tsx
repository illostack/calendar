"use client";

import {
  CalendarEvent,
  isDateBetween,
  useCalendar,
  useIsInDate
} from "@illostack/react-calendar";
import React from "react";

import { CalendarMonthEventCardContent } from "./calendar-month-event-card-content";

interface CalendarMonthActiveResizeContentProps {
  date: Date;
  resizingEvent: CalendarEvent;
}

const CalendarMonthActiveResizeContent =
  React.memo<CalendarMonthActiveResizeContentProps>(
    ({ date, resizingEvent }) => {
      const isSameDate = React.useMemo(
        () => isDateBetween(date, resizingEvent.startAt, resizingEvent.endAt),
        [date, resizingEvent]
      );

      if (!isSameDate) {
        return null;
      }

      return (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            zIndex: 2,
            padding: "1px"
          }}
        >
          <CalendarMonthEventCardContent event={resizingEvent} />
        </div>
      );
    }
  );
CalendarMonthActiveResizeContent.displayName =
  "CalendarMonthActiveResizeContent";

interface CalendarMonthActiveResizeProps {
  date: Date;
}

const CalendarMonthActiveResize = React.memo<CalendarMonthActiveResizeProps>(
  ({ date }) => {
    const calendar = useCalendar();
    const resizingEvent = calendar.useWatch((s) => s.resizingEvent);
    const isInDate = useIsInDate(
      date,
      resizingEvent?.startAt,
      resizingEvent?.endAt
    );

    if (!resizingEvent || !isInDate) {
      return null;
    }

    return (
      <CalendarMonthActiveResizeContent
        date={date}
        resizingEvent={resizingEvent}
      />
    );
  }
);
CalendarMonthActiveResize.displayName = "CalendarMonthActiveResize";

export { CalendarMonthActiveResize };
