"use client";

import { rowToTime, useCalendar } from "@illostack/react-calendar";
import * as React from "react";

const useCalendarDayResize = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const calendar = useCalendar();

  calendar.useEffect(
    (s) => s.resizingEvent,
    (s) => {
      if (!s.resizingEvent) {
        return;
      }

      const container = containerRef.current;

      if (!container) {
        return;
      }

      const handleResize = (e: MouseEvent) => {
        const resizingEvent = calendar.getResizingEvent();
        if (!resizingEvent) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const y = e.clientY - rect.top;
        const isResizingTop = calendar.getIsResizingTop();

        if (isResizingTop) {
          requestAnimationFrame(() => {
            const { totalRows } = calendar.getLayout();

            const row = Math.max(Math.floor((y / rect.height) * totalRows), 0);
            const newStartAt = rowToTime(resizingEvent.startAt, row, calendar);
            if (newStartAt >= resizingEvent.endAt) return;

            calendar.updateResizing({
              ...resizingEvent,
              startAt: newStartAt
            });
          });
        }

        const isResizingBottom = calendar.getIsResizingBottom();

        if (isResizingBottom) {
          requestAnimationFrame(() => {
            const { totalRows } = calendar.getLayout();
            const row = Math.min(
              Math.floor((y / rect.height) * totalRows),
              totalRows
            );
            const newEndAt = rowToTime(resizingEvent.startAt, row, calendar);
            if (newEndAt <= resizingEvent.startAt) return;

            calendar.updateResizing({
              ...resizingEvent,
              endAt: newEndAt
            });
          });
        }
      };

      const handleStopResize = () => {
        const resizingEvent = calendar.getResizingEvent();
        if (!resizingEvent) return;
        const originalEvent = calendar.getEvent(resizingEvent.id);
        if (!originalEvent) return;
        if (
          resizingEvent.startAt.getTime() === originalEvent.startAt.getTime() &&
          resizingEvent.endAt.getTime() === originalEvent.endAt.getTime()
        ) {
          calendar.stopResizing();
          return;
        }

        calendar.updateEvent(resizingEvent);
        calendar.stopResizing();
      };

      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", handleStopResize);

      return () => {
        window.removeEventListener("mousemove", handleResize);
        window.removeEventListener("mouseup", handleStopResize);
      };
    }
  );

  return containerRef;
};

export { useCalendarDayResize };
