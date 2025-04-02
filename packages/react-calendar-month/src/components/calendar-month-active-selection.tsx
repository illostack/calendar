"use client";

import {
  CalendarSection,
  useCalendar,
  useDateFragments
} from "@illostack/react-calendar";
import React from "react";
import { useMonthViewPosition } from "../hooks/use-month-view-position";

interface CalendarMonthActiveSelectionContentProps {
  date: Date;
  selection: CalendarSection;
}

const CalendarMonthActiveSelectionContent =
  React.memo<CalendarMonthActiveSelectionContentProps>(({ date }) => {
    const position = useMonthViewPosition(date);

    return (
      <div
        className="pointer-events-none absolute bg-[hsl(var(--calendar-primary)/0.1)]"
        style={{ ...position }}
      />
    );
  });
CalendarMonthActiveSelectionContent.displayName =
  "CalendarMonthActiveSelectionContent";

interface CalendarMonthActiveSelectionProps {}

const CalendarMonthActiveSelection =
  React.memo<CalendarMonthActiveSelectionProps>(() => {
    const calendar = useCalendar();
    const selection = calendar.useWatch((s) => s.selection);
    const fragments = useDateFragments(selection?.startAt, selection?.endAt);

    if (!selection) {
      return null;
    }

    return (
      <React.Fragment>
        {fragments.map((fragment) => (
          <CalendarMonthActiveSelectionContent
            key={fragment.id}
            date={fragment.date}
            selection={selection}
          />
        ))}
      </React.Fragment>
    );
  });
CalendarMonthActiveSelection.displayName = "CalendarMonthActiveSelection";

export { CalendarMonthActiveSelection };
