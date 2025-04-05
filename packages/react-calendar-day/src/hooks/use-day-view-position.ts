"use client";

import { useCalendar } from "@illostack/react-calendar";
import * as React from "react";

import { computePositionFromTime } from "../lib/utils";

const useDayViewPosition = (startAt: Date, endAt: Date) => {
  const calendar = useCalendar();
  const view = calendar.useWatch((s) =>
    s.currentView.compositeId ? s.currentView.compositeId() : s.currentView.id
  );

  return React.useMemo(() => {
    return computePositionFromTime(startAt, endAt, calendar);
  }, [startAt, endAt, calendar, view]);
};

export { useDayViewPosition };
