"use client";

import { useCalendar } from "@illostack/react-calendar";
import * as React from "react";

import { computeEventTimeRangeFromPointer } from "../lib/utils";

const useCalendarMonthDrag = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const initOffetRef = React.useRef<number>(null);
  const calendar = useCalendar();

  calendar.useEffect(
    (s) => s.isDragging,
    (state) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      if (!state.isDragging) {
        const handleDragStart = (event: MouseEvent) => {
          const eventId = (event.target as HTMLElement).dataset.eventId;

          if (!eventId) {
            return;
          }

          const calendarEvent = calendar.getEvent(eventId);

          if (!calendarEvent) {
            return;
          }

          const { startAt } = computeEventTimeRangeFromPointer(
            event,
            container,
            calendar
          );

          initOffetRef.current =
            startAt.getTime() - calendarEvent.startAt.getTime();

          calendar.startDragging(calendarEvent);
        };

        container.addEventListener("dragstart", handleDragStart);

        return () => {
          container.removeEventListener("dragstart", handleDragStart);
        };
      }

      const handleDrag = (event: MouseEvent) => {
        const draggingEvent = calendar.getDraggingEvent();

        if (!draggingEvent) {
          return;
        }

        const offset = initOffetRef.current;

        if (offset === null) {
          return;
        }

        const { startAt } = computeEventTimeRangeFromPointer(
          event,
          container,
          calendar
        );

        const duration =
          draggingEvent.endAt.getTime() - draggingEvent.startAt.getTime();

        const newStartAt = new Date(startAt.getTime() - offset);
        const newEndAt = new Date(startAt.getTime() + duration - offset);

        calendar.updateDragging({
          ...draggingEvent,
          startAt: newStartAt,
          endAt: newEndAt
        });
      };

      const handleDragEnd = (event: MouseEvent) => {
        const draggingEvent = calendar.getDraggingEvent();

        if (!draggingEvent) {
          return;
        }

        calendar.updateEvent(draggingEvent);
        calendar.stopDragging();
      };

      container.addEventListener("dragover", handleDrag);
      container.addEventListener("dragend", handleDragEnd);

      return () => {
        container.removeEventListener("dragover", handleDrag);
        container.removeEventListener("dragend", handleDragEnd);
      };
    }
  );

  return containerRef;
};

export { useCalendarMonthDrag };
