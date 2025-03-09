import {
  CalendarSection,
  isDateBetween,
  useCalendar,
  useIsInDate
} from "@illostack/react-calendar";
import * as React from "react";

interface CalendarMonthActiveSectionIndicatorProps {
  date: Date;
  activeSection: CalendarSection;
}

const CalendarMonthActiveSectionIndicator =
  React.memo<CalendarMonthActiveSectionIndicatorProps>(
    ({ date, activeSection }) => {
      const isSameDate = React.useMemo(
        () => isDateBetween(date, activeSection.startAt, activeSection.endAt),
        [date, activeSection]
      );

      if (!isSameDate) return null;

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
CalendarMonthActiveSectionIndicator.displayName =
  "CalendarMonthActiveSectionIndicator";

interface CalendarMonthActiveSectionProps {
  date: Date;
}

const CalendarMonthActiveSection = React.memo<CalendarMonthActiveSectionProps>(
  ({ date }) => {
    const calendar = useCalendar();
    const activeSection = calendar.useWatch((s) => s.activeSection);
    const isInDate = useIsInDate(
      date,
      activeSection?.startAt,
      activeSection?.endAt
    );

    if (!activeSection || !isInDate) {
      return null;
    }

    return (
      <CalendarMonthActiveSectionIndicator
        date={date}
        activeSection={activeSection}
      />
    );
  }
);
CalendarMonthActiveSection.displayName = "CalendarMonthActiveSection";

export { CalendarMonthActiveSection };
