"use client";

import {
  addWeeks,
  CalendarEvent,
  createCalendarView,
  getWeekDays
} from "@illostack/react-calendar";
import {
  CalendarDayEventCardContent,
  CalendarDaysViewTemplate
} from "@illostack/react-calendar-day";

const VIEW_ID = "week";
type CalendarWeekMeta = {
  chip: React.ComponentType<{ event: CalendarEvent }>;
};
type CalendarWeekConfiguration = {
  chip?: React.ComponentType<{ event: CalendarEvent }>;
};

const view = createCalendarView<
  typeof VIEW_ID,
  CalendarWeekMeta,
  CalendarWeekConfiguration
>({
  id: VIEW_ID,
  content: CalendarDaysViewTemplate,
  viewDatesFn(date, weekStartsOn) {
    return getWeekDays(date, weekStartsOn).map((date) => ({
      date,
      isOutside: false
    }));
  },
  increaseFn(date) {
    return addWeeks(date, 1);
  },
  decreaseFn(date) {
    return addWeeks(date, -1);
  },
  meta: {
    chip: CalendarDayEventCardContent
  },
  configure(props) {
    const { chip } = props;

    if (chip) {
      this.meta.chip = chip;
    }

    return this;
  }
});

export { view as CalendarWeekView };
