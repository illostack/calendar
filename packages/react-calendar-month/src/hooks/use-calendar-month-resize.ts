"use client";

import { useCalendar } from "@illostack/react-calendar";
import * as React from "react";

import { computeEventTimeRangeFromPointer } from "../lib/utils";

const useCalendarMonthResize = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const calendar = useCalendar();

  calendar.useEffect(
    (s) => s.resizingEvent,
    (s) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      if (!s.resizingEvent) {
        const handleContainerMouseDown = (event: MouseEvent) => {
          const { resizeTopEventId, resizeBottomEventId } = (
            event.target as HTMLElement
          ).dataset;

          if (resizeTopEventId) {
            event.preventDefault();
            event.stopPropagation();
            const calendarEvent = calendar.getEvent(resizeTopEventId);

            if (!calendarEvent) {
              return;
            }

            calendar.startResizingTop(calendarEvent);
          }

          if (resizeBottomEventId) {
            event.preventDefault();
            event.stopPropagation();
            const calendarEvent = calendar.getEvent(resizeBottomEventId);

            if (!calendarEvent) {
              return;
            }

            calendar.startResizingBottom(calendarEvent);
          }
        };

        container.addEventListener("mousedown", handleContainerMouseDown);

        return () => {
          container.removeEventListener("mousedown", handleContainerMouseDown);
        };
      }

      const handleResize = (event: MouseEvent) => {
        const resizingEvent = calendar.getResizingEvent();

        if (!resizingEvent) {
          return;
        }

        const isResizingTop = calendar.getIsResizingTop();

        if (isResizingTop) {
          const { startAt } = computeEventTimeRangeFromPointer(
            event,
            container,
            calendar
          );

          if (startAt >= resizingEvent.endAt) {
            return;
          }

          calendar.updateResizing({
            ...resizingEvent,
            startAt
          });
        }

        const isResizingBottom = calendar.getIsResizingBottom();

        if (isResizingBottom) {
          const { endAt } = computeEventTimeRangeFromPointer(
            event,
            container,
            calendar
          );

          if (endAt <= resizingEvent.startAt) {
            return;
          }

          calendar.updateResizing({
            ...resizingEvent,
            endAt
          });
        }
      };

      const handleStopResize = () => {
        const resizingEvent = calendar.getResizingEvent();

        if (!resizingEvent) {
          return;
        }

        const originalEvent = calendar.getEvent(resizingEvent.id);

        if (!originalEvent) {
          return;
        }

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

export { useCalendarMonthResize };
