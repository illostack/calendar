"use client";

import {
  CalendarEvent,
  DateFragmentType,
  useCalendar,
  useDateFragments
} from "@illostack/react-calendar";
import React from "react";

import { cn } from "@illostack/react-calendar-ui";
import { useMonthViewPosition } from "../hooks/use-month-view-position";
import { CalendarMonthEventCardContent } from "./calendar-month-event-card-content";

interface CalendarMonthActiveResizeContentProps {
  date: Date;
  resizingEvent: CalendarEvent;
  fragmentType: DateFragmentType;
}

const CalendarMonthActiveResizeContent =
  React.memo<CalendarMonthActiveResizeContentProps>(
    ({ date, resizingEvent, fragmentType }) => {
      const position = useMonthViewPosition(date);

      return (
        <div
          className="absolute py-1"
          style={{ ...position, height: "2.25rem" }}
        >
          <CalendarMonthEventCardContent
            event={resizingEvent}
            className={cn(
              "shadow-none [&_*]:hidden",
              fragmentType === "start" && "rounded-r-none",
              fragmentType === "end" && "rounded-l-none before:hidden",
              fragmentType == "full" && "",
              fragmentType === "middle" && "rounded-none before:hidden"
            )}
          />
        </div>
      );
    }
  );
CalendarMonthActiveResizeContent.displayName =
  "CalendarMonthActiveResizeContent";

interface CalendarMonthActiveResizeProps {}

const CalendarMonthActiveResize = React.memo<CalendarMonthActiveResizeProps>(
  () => {
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
        {fragments.map((fragment) => (
          <CalendarMonthActiveResizeContent
            key={fragment.id}
            date={fragment.date}
            fragmentType={fragment.type}
            resizingEvent={resizingEvent}
          />
        ))}
      </React.Fragment>
    );
  }
);
CalendarMonthActiveResize.displayName = "CalendarMonthActiveResize";

export { CalendarMonthActiveResize };
