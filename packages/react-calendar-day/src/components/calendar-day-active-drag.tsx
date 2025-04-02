"use client";

import {
  CalendarEvent,
  DateFragmentType,
  useCalendar,
  useDateFragments
} from "@illostack/react-calendar";
import React from "react";

import { cn } from "@illostack/react-calendar-ui";
import { useDayViewPosition } from "../hooks/use-day-view-position";
import { CalendarDayEventCardContent } from "./calendar-day-event-card-content";

interface CalendarDayActiveDragContentProps {
  startAt: Date;
  endAt: Date;
  draggingEvent: CalendarEvent;
  fragmentType: DateFragmentType;
}

const CalendarDayActiveDragContent =
  React.memo<CalendarDayActiveDragContentProps>(
    ({ startAt, endAt, draggingEvent, fragmentType }) => {
      const position = useDayViewPosition(startAt, endAt);

      return (
        <div className="absolute p-px" style={{ ...position }}>
          <CalendarDayEventCardContent
            event={draggingEvent}
            className={cn(
              "shadow-xl",
              fragmentType === "start" && "rounded-b-none",
              fragmentType === "end" && "rounded-t-none",
              fragmentType == "full" && "",
              fragmentType === "middle" && "rounded-none before:hidden"
            )}
          />
        </div>
      );
    }
  );
CalendarDayActiveDragContent.displayName = "CalendarDayActiveDragContent";

interface CalendarDayActiveDragProps {}

const CalendarDayActiveDrag = React.memo<CalendarDayActiveDragProps>(() => {
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
        <CalendarDayActiveDragContent
          key={fragment.id}
          startAt={fragment.startAt}
          endAt={fragment.endAt}
          fragmentType={fragment.type}
          draggingEvent={draggingEvent}
        />
      ))}
    </React.Fragment>
  );
});
CalendarDayActiveDrag.displayName = "CalendarDayActiveDrag";

export { CalendarDayActiveDrag };
