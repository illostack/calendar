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

interface CalendarMonthActiveDragContentProps {
  date: Date;
  draggingEvent: CalendarEvent;
  fragmentType: DateFragmentType;
}

const CalendarMonthActiveDragContent =
  React.memo<CalendarMonthActiveDragContentProps>(
    ({ date, draggingEvent, fragmentType }) => {
      const position = useMonthViewPosition(date);

      return (
        <div
          className="absolute py-1"
          style={{
            ...position,
            height: "2.25rem"
          }}
        >
          <CalendarMonthEventCardContent
            event={draggingEvent}
            className={cn(
              "border-none shadow-none [&_*]:hidden",
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
CalendarMonthActiveDragContent.displayName = "CalendarMonthActiveDragContent";

interface CalendarMonthActiveDragProps {}

const CalendarMonthActiveDrag = React.memo<CalendarMonthActiveDragProps>(() => {
  const calendar = useCalendar();
  const draggingEvent = calendar.useWatch((s) => s.draggingEvent);
  const fragments = useDateFragments(
    draggingEvent?.startAt,
    draggingEvent?.endAt
  );

  if (!draggingEvent) {
    return null;
  }

  return (
    <React.Fragment>
      {fragments.map((fragment) => (
        <CalendarMonthActiveDragContent
          key={fragment.id}
          date={fragment.date}
          fragmentType={fragment.type}
          draggingEvent={draggingEvent}
        />
      ))}
    </React.Fragment>
  );
});
CalendarMonthActiveDrag.displayName = "CalendarMonthActiveDrag";

export { CalendarMonthActiveDrag };
