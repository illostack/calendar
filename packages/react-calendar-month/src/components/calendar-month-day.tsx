"use client";

import {
  CalendarEventCard,
  isSameDay,
  useCalendar
} from "@illostack/react-calendar";
import { Button, cn } from "@illostack/react-calendar-ui";
import * as React from "react";

import { CalendarMonthEventCardContent } from "./calendar-month-event-card-content";

interface CalendarMonthViewEventsPanelProps {
  date: Date;
}

const CalendarMonthViewEventsPanel =
  React.memo<CalendarMonthViewEventsPanelProps>(({ date }) => {
    const calendar = useCalendar();
    const events = calendar.useDayEvents(date);
    const firtsEvents = React.useMemo(() => events.slice(0, 3), [events]);
    const otherEventsLength = React.useMemo(() => events.length - 3, [events]);

    return (
      <React.Fragment>
        {firtsEvents.map((event) => (
          <CalendarEventCard
            key={event.id}
            event={event}
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
            className="pointer-events-auto h-auto font-semibold"
            onClick={() => calendar.changeDate(date, "day")}
          >
            {otherEventsLength} {calendar.getTranslations().literals.more}
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
  date: Date;
  isOutside: boolean;
}

const CalendarMonthDay: React.FC<CalendarMonthDayProps> = React.memo(
  ({ date, isOutside }) => {
    return (
      <div
        className={cn(
          "ring-border/40 pointer-events-none relative flex flex-col gap-1 overflow-hidden ring-[1px]",
          isOutside ? "text-muted-foreground bg-muted/40" : "text-foreground"
        )}
      >
        <div className="relative flex flex-none justify-center px-1 pt-1">
          <CalendarMonthDayButton date={date} />
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="relative grid h-full w-full grid-rows-4 gap-y-px px-1 pb-1">
            <CalendarMonthViewEventsPanel date={date} />
          </div>
        </div>
      </div>
    );
  }
);
CalendarMonthDay.displayName = "CalendarMonthDay";

export { CalendarMonthDay };
