"use client";

import * as React from "react";
import { useCalendar } from "../components/calendar";
import { addMinutes } from "../lib/time";

export type DateFragmentType = "start" | "end" | "full" | "middle";

interface DateFragment {
  id: string;
  type: DateFragmentType;
  date: Date;
  startAt: Date;
  endAt: Date;
}

const useDateFragments = (startAt?: Date, endAt?: Date): DateFragment[] => {
  const calendar = useCalendar();
  const dates = calendar.getDates();
  const minDate = new Date(dates[0]?.date!.setHours(0, 0, 0, 0)!);
  const maxDate = new Date(
    dates[dates.length - 1]?.date!.setHours(23, 59, 59, 59)!
  );

  const fragments = React.useMemo(() => {
    if (!startAt || !endAt) {
      return [];
    }

    const result: DateFragment[] = [];
    let currentDate = new Date(startAt);
    const endDate = addMinutes(endAt, -1);

    while (currentDate <= endDate) {
      if (currentDate < minDate || currentDate > maxDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0);
        continue;
      }

      if (
        currentDate.toDateString() === startAt.toDateString() &&
        currentDate.toDateString() === endDate.toDateString()
      ) {
        result.push({
          id: `fragment-${currentDate.toISOString()}-${minDate.toISOString()}-${maxDate.toISOString()}`,
          type: "full",
          date: new Date(currentDate),
          startAt: new Date(startAt),
          endAt: new Date(endAt)
        });
      } else if (currentDate.getDate() === startAt.getDate()) {
        result.push({
          id: `fragment-${currentDate.toISOString()}-${minDate.toISOString()}-${maxDate.toISOString()}`,
          type: "start",
          date: new Date(currentDate),
          startAt: new Date(startAt),
          endAt: new Date(new Date(currentDate).setHours(24, 0, 0, 0))
        });
      } else if (currentDate.getDate() === endDate.getDate()) {
        result.push({
          id: `fragment-${currentDate.toISOString()}-${minDate.toISOString()}-${maxDate.toISOString()}`,
          type: "end",
          date: new Date(currentDate),
          startAt: new Date(new Date(currentDate).setHours(0, 0, 0, 0)),
          endAt: new Date(endAt)
        });
      } else {
        result.push({
          id: `fragment-${currentDate.toISOString()}-${minDate.toISOString()}-${maxDate.toISOString()}`,
          type: "middle",
          date: new Date(currentDate),
          startAt: new Date(new Date(currentDate).setHours(0, 0, 0, 0)),
          endAt: new Date(new Date(currentDate).setHours(24, 0, 0, 0))
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
    }

    return result;
  }, [startAt, endAt, minDate, maxDate]);

  return fragments;
};

export { useDateFragments };
