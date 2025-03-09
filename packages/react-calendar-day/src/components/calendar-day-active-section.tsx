import {
  CalendarSection,
  useCalendar,
  useCalendarPosition,
  useIsInDate
} from "@illostack/react-calendar";
import * as React from "react";

interface CalendarDayActiveSectionIndicatorProps {
  date: Date;
  activeSection: CalendarSection;
}

const CalendarDayActiveSectionIndicator =
  React.memo<CalendarDayActiveSectionIndicatorProps>(
    ({ date, activeSection }) => {
      const { top, height, left, right } = useCalendarPosition(
        date,
        activeSection.startAt,
        activeSection.endAt
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
    }
  );
CalendarDayActiveSectionIndicator.displayName =
  "CalendarDayActiveSectionIndicator";

interface CalendarDayActiveSectionProps {
  date: Date;
}

const CalendarDayActiveSection = React.memo<CalendarDayActiveSectionProps>(
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
      <CalendarDayActiveSectionIndicator
        date={date}
        activeSection={activeSection}
      />
    );
  }
);
CalendarDayActiveSection.displayName = "CalendarDayActiveSection";

export { CalendarDayActiveSection };
