"use client";

import {
  CalendarSection,
  useCalendar,
  useDateFragments
} from "@illostack/react-calendar";
import * as React from "react";

import { useMonthViewPosition } from "../hooks/use-month-view-position";

interface CalendarMonthActiveSectionIndicatorProps {
  date: Date;
  activeSection: CalendarSection;
}

const CalendarMonthActiveSectionIndicator =
  React.memo<CalendarMonthActiveSectionIndicatorProps>(({ date }) => {
    const position = useMonthViewPosition(date);

    return (
      <div
        className="pointer-events-none absolute bg-[hsl(var(--calendar-primary)/0.1)]"
        style={{ ...position }}
      />
    );
  });
CalendarMonthActiveSectionIndicator.displayName =
  "CalendarMonthActiveSectionIndicator";

interface CalendarMonthActiveSectionProps {}

const CalendarMonthActiveSection = React.memo<CalendarMonthActiveSectionProps>(
  () => {
    const calendar = useCalendar();
    const activeSection = calendar.useWatch((s) => s.activeSection);
    const fragments = useDateFragments(
      activeSection?.startAt,
      activeSection?.endAt
    );

    if (!activeSection) {
      return null;
    }

    return (
      <React.Fragment>
        {fragments.map((fragment) => (
          <CalendarMonthActiveSectionIndicator
            key={fragment.id}
            date={fragment.date}
            activeSection={activeSection}
          />
        ))}
      </React.Fragment>
    );
  }
);
CalendarMonthActiveSection.displayName = "CalendarMonthActiveSection";

export { CalendarMonthActiveSection };
