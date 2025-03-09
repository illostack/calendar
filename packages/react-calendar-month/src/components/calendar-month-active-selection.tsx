"use client";

import {
  CalendarSection,
  isDateBetween,
  useCalendar,
  useIsInDate
} from "@illostack/react-calendar";
import React from "react";

interface CalendarMonthActiveSelectionContentProps {
  date: Date;
  selection: CalendarSection;
}

const CalendarMonthActiveSelectionContent =
  React.memo<CalendarMonthActiveSelectionContentProps>(
    ({ date, selection }) => {
      const isSameDate = React.useMemo(
        () => isDateBetween(date, selection.startAt, selection.endAt),
        [date, selection]
      );

      if (!isSameDate) {
        return null;
      }

      return (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            pointerEvents: "none",
            backgroundColor: "hsl(var(--calendar-primary) / 0.4)"
          }}
        />
      );
    }
  );
CalendarMonthActiveSelectionContent.displayName =
  "CalendarMonthActiveSelectionContent";

interface CalendarMonthActiveSelectionProps {
  date: Date;
}

const CalendarMonthActiveSelection =
  React.memo<CalendarMonthActiveSelectionProps>(({ date }) => {
    const calendar = useCalendar();
    const selection = calendar.useWatch((s) => s.selection);
    const isInDate = useIsInDate(date, selection?.startAt, selection?.endAt);

    if (!selection || !isInDate) {
      return null;
    }

    return (
      <CalendarMonthActiveSelectionContent date={date} selection={selection} />
    );
  });
CalendarMonthActiveSelection.displayName = "CalendarMonthActiveSelection";

export { CalendarMonthActiveSelection };
