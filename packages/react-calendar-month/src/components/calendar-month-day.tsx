"use client";

import {
  CalendarEventCard,
  isSameDay,
  useCalendar,
  useViewEvents
} from "@illostack/react-calendar";
import { Button, cn } from "@illostack/react-calendar-ui";
import * as React from "react";

import { CalendarMonthActiveResize } from "./calendar-month-active-resize";
import { CalendarMonthActiveSection } from "./calendar-month-active-section";
import { CalendarMonthActiveSelection } from "./calendar-month-active-selection";
import { CalendarMonthDndIndicator } from "./calendar-month-dnd-indicator";
import { CalendarMonthEventCardContent } from "./calendar-month-event-card-content";

interface CalendarMonthViewEventsPanelProps {
  date: Date;
}

const CalendarMonthViewEventsPanel =
  React.memo<CalendarMonthViewEventsPanelProps>(({ date }) => {
    const calendar = useCalendar();
    const events = useViewEvents(date);
    const firtsEvents = React.useMemo(() => events.slice(0, 3), [events]);
    const otherEventsLength = React.useMemo(() => events.length - 3, [events]);
    const translations = calendar.getTranslations();

    return (
      <React.Fragment>
        {firtsEvents.map((event) => (
          <CalendarEventCard
            key={event.id}
            event={event}
            date={date}
            resizeOrientation="horizontal"
          >
            <CalendarMonthEventCardContent event={event} />
          </CalendarEventCard>
        ))}
        {events.length > 3 && (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="pointer-events-auto relative z-[1] h-auto rounded-sm font-semibold"
            onClick={() => calendar.changeDate(date, "day")}
          >
            {otherEventsLength} {translations.literals.more}
          </Button>
        )}
      </React.Fragment>
    );
  });
CalendarMonthViewEventsPanel.displayName = "CalendarMonthViewEventsPanel";

interface CalendarMonthDayButtonProps {
  date: Date;
}

const CalendarMonthDayButton = React.memo<CalendarMonthDayButtonProps>(
  ({ date }) => {
    const calendar = useCalendar();
    const formatters = calendar.getFormatters();

    const isCurrentDay = React.useMemo(
      () => isSameDay(date, new Date()),
      [date]
    );

    return (
      <Button
        type="button"
        title={`Go to ${formatters.weekDayName(date)} ${formatters.weekDay(
          date
        )}`}
        variant={isCurrentDay ? "default" : "ghost"}
        className="pointer-events-auto relative z-[1] h-7 w-7 rounded-sm px-2 text-xs capitalize"
        aria-label={`Go to ${formatters.weekDayName(date)} ${formatters.weekDay(
          date
        )}`}
        onClick={() => calendar.changeDate(date, "day")}
      >
        {formatters.weekDay(date)}
      </Button>
    );
  }
);
CalendarMonthDayButton.displayName = "CalendarMonthDayButton";

interface CalendarMonthDayProps {
  index: number;
  date: Date;
  isOutside: boolean;
}

const CalendarMonthDay: React.FC<CalendarMonthDayProps> = React.memo(
  ({ index, date, isOutside }) => {
    return (
      <div
        className={cn(
          "pointer-events-none relative flex flex-col gap-1",
          index % 7 === 0 ? "border-l-0" : "border-l",
          index < 7 ? "border-t-0" : "border-t",
          isOutside ? "text-muted-foreground bg-muted/40" : "text-foreground"
        )}
      >
        <div className="relative flex flex-none justify-center px-1 pt-1">
          <CalendarMonthDayButton date={date} />
        </div>
        <div className="flex-grow">
          <div className="relative grid h-full w-full grid-rows-4 gap-y-px">
            <CalendarMonthActiveResize date={date} />
            <CalendarMonthViewEventsPanel date={date} />
          </div>
        </div>
        <CalendarMonthActiveSection date={date} />
        <CalendarMonthActiveSelection date={date} />
        <CalendarMonthDndIndicator date={date} />
      </div>
    );
  }
);
CalendarMonthDay.displayName = "CalendarMonthDay";

export { CalendarMonthDay };
