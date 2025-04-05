"use client";

import {
  CalendarEventCard,
  CalendarEventWithOverlap,
  useCalendar,
  useDateFragments
} from "@illostack/react-calendar";
import * as React from "react";

import { useDayViewPosition } from "../hooks/use-day-view-position";

interface CalendarDayEventProps {
  startAt: Date;
  endAt: Date;
  event: CalendarEventWithOverlap;
}

const CalendarDayEnvent = React.memo<CalendarDayEventProps>(
  ({ startAt, endAt, event }) => {
    const position = useDayViewPosition(startAt, endAt);
    const calendar = useCalendar();
    const Chip = React.useMemo(
      () => calendar.getCurrentView().meta.chip as typeof CalendarEventCard,
      [calendar]
    );

    return (
      <CalendarEventCard
        event={event}
        style={{
          position: "absolute",
          ...position,
          left: `calc(${position.left} + var(--calendar-overlap-size, 5%) * ${event.overlap})`,
          width: `calc(${position.width} - var(--calendar-overlap-size, 5%) * ${event.overlap})`
        }}
      >
        <Chip event={event} />
      </CalendarEventCard>
    );
  }
);

interface CalendarDayEnventFragmentsProps {
  event: CalendarEventWithOverlap;
}

const CalendarDayEnventFragments = React.memo<CalendarDayEnventFragmentsProps>(
  ({ event }) => {
    const fragments = useDateFragments(event.startAt, event.endAt);

    return (
      <React.Fragment>
        {fragments.map((fragment) => (
          <CalendarDayEnvent
            key={fragment.id}
            startAt={fragment.startAt}
            endAt={fragment.endAt}
            event={event}
          />
        ))}
      </React.Fragment>
    );
  }
);

interface CalendarDayEventsProps {}

const CalendarDayEvents = React.memo<CalendarDayEventsProps>(() => {
  const calendar = useCalendar();
  const events = calendar.useViewEvents();

  return (
    <React.Fragment>
      {events.map((event) => (
        <CalendarDayEnventFragments key={event.id} event={event} />
      ))}
    </React.Fragment>
  );
});
CalendarDayEvents.displayName = "CalendarDayEvents";

export { CalendarDayEvents };
