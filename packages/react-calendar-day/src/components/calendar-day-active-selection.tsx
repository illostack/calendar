"use client";

import {
  CalendarSection,
  useCalendar,
  useCalendarPosition,
  useIsInDate
} from "@illostack/react-calendar";
import React from "react";

interface CalendarDayActiveSelectionContentProps {
  date: Date;
  selection: CalendarSection;
}

const CalendarDayActiveSelectionContent =
  React.memo<CalendarDayActiveSelectionContentProps>(({ date, selection }) => {
    const { top, height, left, right } = useCalendarPosition(
      date,
      selection.startAt,
      selection.endAt
    );

    return (
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          pointerEvents: "none",
          top,
          left,
          right,
          height,
          backgroundColor: "hsl(var(--calendar-primary) / 0.4)"
        }}
      />
    );
  });
CalendarDayActiveSelectionContent.displayName =
  "CalendarDayActiveSelectionContent";

interface CalendarDayActiveSelectionProps {
  date: Date;
}

const CalendarDayActiveSelection = React.memo<CalendarDayActiveSelectionProps>(
  ({ date }) => {
    const calendar = useCalendar();
    const selection = calendar.useWatch((s) => s.selection);
    const isInDate = useIsInDate(date, selection?.startAt, selection?.endAt);

    if (!selection || !isInDate) {
      return null;
    }

    return (
      <CalendarDayActiveSelectionContent date={date} selection={selection} />
    );
  }
);
CalendarDayActiveSelection.displayName = "CalendarDayActiveSelection";

export { CalendarDayActiveSelection };
