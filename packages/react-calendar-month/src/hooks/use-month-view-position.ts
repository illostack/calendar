"use client";

import { useCalendar } from "@illostack/react-calendar";
import * as React from "react";

import { computePositionFromTime } from "../lib/utils";

const useMonthViewPosition = (date: Date) => {
  const calendar = useCalendar();
  const view = calendar.useWatch((s) => s.view);

  return React.useMemo(() => {
    return computePositionFromTime(date, calendar);
  }, [date, calendar, view]);
};

export { useMonthViewPosition };
