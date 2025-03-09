"use client";

import { DragOverlay, useCalendar } from "@illostack/react-calendar";
import * as React from "react";

import { CalendarMonthEventCardContent } from "./calendar-month-event-card-content";

const CalendarMonthDndOverlay = React.memo(() => {
  const calendar = useCalendar();
  const draggingEvent = calendar.useWatch((s) => s.draggingEvent);

  return (
    <DragOverlay>
      {draggingEvent && <CalendarMonthEventCardContent event={draggingEvent} />}
    </DragOverlay>
  );
});
CalendarMonthDndOverlay.displayName = "CalendarMonthDndOverlay";

export { CalendarMonthDndOverlay };
