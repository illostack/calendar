"use client";

import { addMinutes, useCalendar } from "@illostack/react-calendar";
import * as React from "react";

import { computeEventTimeRangeFromPointer } from "../lib/utils";

const useCalendarDaySelection = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const initSelectionRef = React.useRef<Date>(null);
  const calendar = useCalendar();

  calendar.useEffect(
    (s) => s.isSelecting,
    (state) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      if (!state.isSelecting) {
        const handleContainerMouseDown = (e: MouseEvent) => {
          if (e.target !== container) {
            return;
          }

          const isDragging = calendar.getIsDragging();
          const isResizingTop = calendar.getIsResizingTop();
          const isResizingBottom = calendar.getIsResizingBottom();

          if (isDragging || isResizingTop || isResizingBottom) {
            return;
          }

          if (e.button !== 0) {
            return;
          }

          calendar.clearActiveSection();
          calendar.startSelection(null);
        };

        container.addEventListener("mousedown", handleContainerMouseDown);

        return () => {
          container.removeEventListener("mousedown", handleContainerMouseDown);
        };
      }

      const handleContainerMouseUp = () => {
        const isSelecting = calendar.getIsSelecting();

        if (!isSelecting) {
          return;
        }

        const selection = calendar.getSelection();

        if (
          !selection ||
          selection.startAt.getTime() === selection.endAt.getTime()
        ) {
          calendar.stopSelection();
          initSelectionRef.current = null;
          return;
        }

        calendar.openCreationForm(selection, () => {
          initSelectionRef.current = null;
          calendar.stopSelection();
        });
      };

      const handleContainerMouseMove = (event: MouseEvent) => {
        const isDragging = calendar.getIsDragging();
        const isResizingTop = calendar.getIsResizingTop();
        const isResizingBottom = calendar.getIsResizingBottom();
        const isSelecting = calendar.getIsSelecting();

        if (isDragging || isResizingTop || isResizingBottom || !isSelecting) {
          return;
        }

        const { startAt } = computeEventTimeRangeFromPointer(
          event,
          container,
          calendar
        );

        const selection = calendar.getSelection();

        if (!selection) {
          initSelectionRef.current = startAt;
          calendar.startSelection({ startAt, endAt: startAt });

          return;
        }

        const initDate = initSelectionRef.current;

        if (!initDate) {
          return;
        }

        const { minutesPerRow } = calendar.getLayout();

        if (startAt < initDate) {
          const endAt = new Date(initDate);
          const { minutesPerRow } = calendar.getLayout();
          endAt.setMinutes(endAt.getMinutes() + minutesPerRow);
          calendar.updateSelection({ startAt, endAt });
        } else if (startAt > initDate) {
          const endAt = addMinutes(startAt, minutesPerRow);
          calendar.updateSelection({ startAt: initDate, endAt });
        } else {
          const endAt = addMinutes(startAt, minutesPerRow);
          calendar.updateSelection({ startAt, endAt });
        }
      };

      container.addEventListener("mousemove", handleContainerMouseMove);
      container.addEventListener("mouseup", handleContainerMouseUp);

      return () => {
        container.removeEventListener("mousemove", handleContainerMouseMove);
        container.removeEventListener("mouseup", handleContainerMouseUp);
      };
    }
  );

  return containerRef;
};

export { useCalendarDaySelection };
