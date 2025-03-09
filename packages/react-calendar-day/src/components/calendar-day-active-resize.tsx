"use client";

import {
  CalendarEvent,
  useCalendar,
  useCalendarPosition,
  useIsInDate
} from "@illostack/react-calendar";
import React from "react";
import { CalendarDayEventCardContent } from "./calendar-day-event-card-content";

interface CalendarDayActiveResizeContentProps {
  date: Date;
  resizingEvent: CalendarEvent;
}

const CalendarDayActiveResizeContent =
  React.memo<CalendarDayActiveResizeContentProps>(({ date, resizingEvent }) => {
    const { top, height, left, right } = useCalendarPosition(
      date,
      resizingEvent.startAt,
      resizingEvent.endAt
    );

    return (
      <div
        style={{
          position: "absolute",
          top,
          left,
          right,
          height,
          zIndex: 1,
          padding: "1px"
        }}
      >
        <CalendarDayEventCardContent event={resizingEvent} />
      </div>
    );
  });
CalendarDayActiveResizeContent.displayName = "CalendarDayActiveResizeContent";

interface CalendarDayActiveResizeProps {
  date: Date;
}

const CalendarDayActiveResize = React.memo<CalendarDayActiveResizeProps>(
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
      <CalendarDayActiveResizeContent
        date={date}
        resizingEvent={resizingEvent}
      />
    );
  }
);
CalendarDayActiveResize.displayName = "CalendarDayActiveResize";

export { CalendarDayActiveResize };
