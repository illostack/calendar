"use client";

import {
  CalendarEventCard,
  useEventsWithPosition,
  useViewEvents
} from "@illostack/react-calendar";
import { cn } from "@illostack/react-calendar-ui";
import React from "react";

import { CalendarDayActiveResize } from "./calendar-day-active-resize";
import { CalendarDayActiveSection } from "./calendar-day-active-section";
import { CalendarDayActiveSelection } from "./calendar-day-active-selection";
import { CalendarDayDndIndicator } from "./calendar-day-dnd-indicator";
import { CalendarDayEventCardContent } from "./calendar-day-event-card-content";

interface CalendarDayEventsPanelProps {
  date: Date;
}

const CalendarDayEventsPanel = React.memo<CalendarDayEventsPanelProps>(
  ({ date }) => {
    const events = useViewEvents(date);
    const transformedEvents = useEventsWithPosition(date, events);

    return (
      <React.Fragment>
        {transformedEvents.map(
          ({ position, top, height, left, right, overlap, ...event }) => (
            <CalendarEventCard
              key={event.id}
              date={date}
              event={event}
              style={{
                top,
                height,
                left,
                right,
                position
              }}
            >
              <CalendarDayEventCardContent event={event} />
            </CalendarEventCard>
          )
        )}
      </React.Fragment>
    );
  }
);
CalendarDayEventsPanel.displayName = "CalendarDayEventsPanel";

interface CalendarDayContentProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date;
}

const CalendarDayContent = React.forwardRef<
  HTMLDivElement,
  CalendarDayContentProps
>(({ date, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("pointer-events-none relative", className)}
      {...props}
    >
      <CalendarDayActiveSection date={date} />
      <CalendarDayActiveSelection date={date} />
      <CalendarDayEventsPanel date={date} />
      <CalendarDayActiveResize date={date} />
      <CalendarDayDndIndicator date={date} />
    </div>
  );
});
CalendarDayContent.displayName = "CalendarDayContent";

export { CalendarDayContent };
