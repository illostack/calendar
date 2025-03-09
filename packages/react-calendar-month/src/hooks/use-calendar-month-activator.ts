"use client";

import { addMinutes, useCalendar } from "@illostack/react-calendar";
import * as React from "react";

import { getDateFromPointerPosition } from "../lib/utils";

const useCalendarMonthActivator = () => {
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
    const defaultDuration = calendar.getDefaultEventDuration();
    const endAt = addMinutes(startAt, defaultDuration);

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

    const handleContainerContextMenu = (e: MouseEvent) => {
      const eventId = (e.target as HTMLElement).dataset.eventId;
      // Si el targer contiene data-event-id, entonces no se debe crear un nuevo evento
      if (eventId) {
        calendar.clearActiveSection();
        calendar.activateEvent(eventId);

        return;
      }

      if (e.target !== container) {
        return;
      }

      const selection = calendar.getSelection();

      if (selection) {
        return;
      }

      calendar.clearActiveEvent();

      const rect = containerRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const y = e.clientY - rect.top;
      const x = e.clientX - rect.left;

      const { startAt, endAt } = getDateFromPointerPosition(
        x,
        y,
        rect,
        calendar
      );

      calendar.activateSection({ startAt, endAt });
    };

    const handleContainerClick = (e: MouseEvent) => {
      const eventId = (e.target as HTMLElement).dataset.eventId;
      // Si el targer contiene data-event-id, entonces no se debe crear un nuevo evento
      if (eventId) {
        e.stopPropagation();
        calendar.clearActiveSection();
        calendar.activateEvent(eventId);

        return;
      }

      if (e.target !== container) {
        return;
      }

      const selection = calendar.getSelection();

      if (selection) {
        return;
      }

      calendar.clearActiveEvent();

      const rect = containerRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const y = e.clientY - rect.top;
      const x = e.clientX - rect.left;

      const { startAt, endAt } = getDateFromPointerPosition(
        x,
        y,
        rect,
        calendar
      );

      calendar.activateSection({ startAt, endAt });
    };

    const handleContainerDoubleClick = (e: MouseEvent) => {
      const eventId = (e.target as HTMLElement).dataset.eventId;
      // Si el targer contiene data-event-id, entonces no se debe crear un nuevo evento
      if (eventId) {
        e.stopPropagation();
        calendar.openUpdateForm(eventId, () => {
          calendar.clearActiveEvent();
        });
        return;
      }

      if (e.target !== container) {
        return;
      }

      const selection = calendar.getSelection();

      if (selection) {
        return;
      }

      calendar.clearActiveEvent();

      const rect = containerRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const y = e.clientY - rect.top;
      const x = e.clientX - rect.left;

      const { startAt, endAt } = getDateFromPointerPosition(
        x,
        y,
        rect,
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

export { useCalendarMonthActivator };
