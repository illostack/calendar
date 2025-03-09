"use client";

import { DragOverlay, useCalendar } from "@illostack/react-calendar";
import * as React from "react";

import { CalendarDayEventCardContent } from "./calendar-day-event-card-content";

const CalendarDayDndOverlay = React.memo(() => {
  const calendar = useCalendar();
  const draggingEvent = calendar.useWatch((s) => s.draggingEvent);

  return (
    <DragOverlay>
      {draggingEvent && <CalendarDayEventCardContent event={draggingEvent} />}
    </DragOverlay>
  );
});
CalendarDayDndOverlay.displayName = "CalendarDayDndOverlay";

export { CalendarDayDndOverlay };
