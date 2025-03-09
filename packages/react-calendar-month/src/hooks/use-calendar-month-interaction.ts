"use client";

import { addDays, useCalendar } from "@illostack/react-calendar";
import * as React from "react";

import { computeEventTimeRangeFromPointer } from "../lib/utils";

const useCalendarMonthInteraction = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const calendar = useCalendar();

  const handlePaste = React.useCallback(() => {
    const activeSection = calendar.getActiveSection();
    const copiedEvent = calendar.getCopiedEvent();
    const cuttedEvent = calendar.getCuttedEvent();

    if (!activeSection || !(copiedEvent || cuttedEvent)) {
      return;
    }

    calendar.pasteEvent({ startAt: activeSection.startAt });
    calendar.stopSelection();
  }, [calendar]);

  const handleCreate = React.useCallback(() => {
    const activeSection = calendar.getActiveSection();

    if (!activeSection) {
      return;
    }

    const startAt = activeSection.startAt;
    const endAt = addDays(startAt, 1);

    calendar.openCreationForm({ startAt, endAt }, () => {
      calendar.clearActiveSection();
    });
  }, [calendar]);

  calendar.useEffect(
    (s) => Boolean(s.activeSection || s.activeEvent),
    (s) => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      if (!s.activeSection && !s.activeEvent) {
        return;
      }

      const handleWindowKeyDown = (e: KeyboardEvent) => {
        // Paste event
        if (e.key === "v" && e.ctrlKey) {
          e.preventDefault();
          handlePaste();
        }
        // Create event
        if (e.key === "c") {
          e.preventDefault();
          handleCreate();
        }
        // Escape
        if (e.key === "Escape") {
          calendar.clearActiveSection();
          calendar.clearActiveEvent();
        }
      };

      const handleWindowClick = (e: MouseEvent) => {
        if (container.contains(e.target as Node)) {
          return;
        }

        calendar.clearActiveSection();
        calendar.clearActiveEvent();
      };

      window.addEventListener("keydown", handleWindowKeyDown);
      window.addEventListener("click", handleWindowClick);

      return () => {
        window.removeEventListener("keydown", handleWindowKeyDown);
        window.removeEventListener("click", handleWindowClick);
      };
    }
  );

  React.useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleContainerContextMenu = (event: MouseEvent) => {
      const eventId = (event.target as HTMLElement).dataset.eventId;

      if (eventId) {
        calendar.clearActiveSection();
        calendar.activateEvent(eventId);

        return;
      }

      if (event.target !== container) {
        return;
      }

      const selection = calendar.getSelection();

      if (selection) {
        return;
      }

      calendar.clearActiveEvent();

      const { startAt, endAt } = computeEventTimeRangeFromPointer(
        event,
        container,
        calendar
      );

      calendar.activateSection({ startAt, endAt });
    };

    const handleContainerClick = (event: MouseEvent) => {
      const eventId = (event.target as HTMLElement).dataset.eventId;

      if (eventId) {
        event.stopPropagation();
        calendar.clearActiveSection();
        calendar.activateEvent(eventId);

        return;
      }

      if (event.target !== container) {
        return;
      }

      const selection = calendar.getSelection();

      if (selection) {
        return;
      }

      calendar.clearActiveEvent();

      const { startAt, endAt } = computeEventTimeRangeFromPointer(
        event,
        container,
        calendar
      );

      calendar.activateSection({ startAt, endAt });
    };

    const handleContainerDoubleClick = (event: MouseEvent) => {
      const eventId = (event.target as HTMLElement).dataset.eventId;

      if (eventId) {
        event.stopPropagation();
        calendar.openUpdateForm(eventId, () => {
          calendar.clearActiveEvent();
        });
        return;
      }

      if (event.target !== container) {
        return;
      }

      const selection = calendar.getSelection();

      if (selection) {
        return;
      }

      calendar.clearActiveEvent();

      const { startAt, endAt } = computeEventTimeRangeFromPointer(
        event,
        container,
        calendar
      );

      calendar.activateSection({ startAt, endAt });

      handleCreate();
    };

    container.addEventListener("click", handleContainerClick);
    container.addEventListener("dblclick", handleContainerDoubleClick);
    container.addEventListener("contextmenu", handleContainerContextMenu);

    return () => {
      container.removeEventListener("mousedown", handleContainerClick);
      container.removeEventListener("dblclick", handleContainerDoubleClick);
      container.removeEventListener("contextmenu", handleContainerContextMenu);
    };
  }, [calendar]);

  return containerRef;
};

export { useCalendarMonthInteraction };
