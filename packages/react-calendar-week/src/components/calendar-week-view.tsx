"use client";

import {
  addWeeks,
  createCalendarView,
  getWeekDays
} from "@illostack/react-calendar";
import { CalendarDaysViewTemplate } from "@illostack/react-calendar-day";

const VIEW_ID = "week";
type CalendarWeekMeta = Record<string, unknown>;
type CalendarWeekConfiguration = Record<string, unknown>;

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
  meta: {},
  configure() {
    return this!;
  }
});

export { view as CalendarWeekView };
