"use client";

import { useCalendar } from "../components/calendar";
import { isDatesBetween } from "../lib/time";

const useIsInDate = (date: Date, startAt?: Date, endAt?: Date) => {
  const calendar = useCalendar();
  const { startHour, endHour } = calendar.getLayout();

  if (!startAt || !endAt) {
    return false;
  }

  return isDatesBetween(
    new Date(date.setHours(startHour, 0, 0, 0)),
    new Date(date.setHours(endHour, 0, 0, 0)),
    startAt,
    endAt
  );
};

export { useIsInDate };
