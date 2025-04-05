"use client";

import {
  addDays,
  createCalendarView,
  getRangeDays
} from "@illostack/react-calendar";
import { CalendarDaysViewTemplate } from "@illostack/react-calendar-day";

const VIEW_ID = "range";
type CalendarRangeMeta = {
  days: number;
};
type CalendarRangeConfiguration = {
  days?: number;
};

const view = createCalendarView<
  typeof VIEW_ID,
  CalendarRangeMeta,
  CalendarRangeConfiguration
>({
  id: VIEW_ID,
  compositeId() {
    return `${this.id}-${this.meta.days}`;
  },
  content: CalendarDaysViewTemplate,
  viewDatesFn(date) {
    return getRangeDays(date, this.meta.days).map((date) => ({
      date,
      isOutside: false
    }));
  },
  increaseFn(date) {
    return addDays(date, this.meta.days);
  },
  decreaseFn(date) {
    return addDays(date, -this.meta.days);
  },
  meta: {
    days: 1
  },
  configure({ days = 1 }) {
    this.meta.days = days;
    return this;
  }
});

export { view as CalendarRangeView };
