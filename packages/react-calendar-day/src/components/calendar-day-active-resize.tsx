"use client";

import {
  CalendarEvent,
  useCalendar,
  useDateFragments
} from "@illostack/react-calendar";
import * as React from "react";

import { useDayViewPosition } from "../hooks/use-day-view-position";
import { CalendarDayEventCardContent } from "./calendar-day-event-card-content";

interface CalendarDayActiveResizeContentProps {
  startAt: Date;
  endAt: Date;
  resizingEvent: CalendarEvent;
  isFirstFragment?: boolean;
}

const CalendarDayActiveResizeContent =
  React.memo<CalendarDayActiveResizeContentProps>(
    ({ startAt, endAt, resizingEvent, isFirstFragment }) => {
      const position = useDayViewPosition(startAt, endAt);

      return (
        <div className="absolute p-0.5" style={{ ...position }}>
          <CalendarDayEventCardContent event={resizingEvent} />
        </div>
      );
    }
  );
CalendarDayActiveResizeContent.displayName = "CalendarDayActiveResizeContent";

interface CalendarDayActiveResizeProps {}

const CalendarDayActiveResize = React.memo<CalendarDayActiveResizeProps>(() => {
  const calendar = useCalendar();
  const resizingEvent = calendar.useWatch((s) => s.resizingEvent);
  const fragments = useDateFragments(
    resizingEvent?.startAt,
    resizingEvent?.endAt
  );

  if (!resizingEvent) {
    return null;
  }

  return (
    <React.Fragment>
      {fragments.map((fragment, fragmentIdx) => (
        <CalendarDayActiveResizeContent
          key={fragment.id}
          isFirstFragment={fragmentIdx === 0}
          startAt={fragment.date}
          endAt={fragment.endAt}
          resizingEvent={resizingEvent}
        />
      ))}
    </React.Fragment>
  );
});
CalendarDayActiveResize.displayName = "CalendarDayActiveResize";

export { CalendarDayActiveResize };
