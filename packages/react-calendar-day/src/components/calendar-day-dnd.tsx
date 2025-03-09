"use client";

import {
  CalendarEvent,
  DragDropEvents,
  DragDropManager,
  DragDropProvider,
  Draggable,
  Droppable,
  KeyboardSensor,
  PointerSensor,
  RestrictToElement,
  useCalendar
} from "@illostack/react-calendar";
import * as React from "react";

import { computeDayEventBounds } from "../lib/utils";

const CalendarDayDndProvider = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const calendar = useCalendar();

    const sensors = React.useMemo(
      () => [
        PointerSensor.configure({
          activationConstraints: { distance: { value: 10 } }
        }),
        KeyboardSensor
      ],
      []
    );

    const onBeforeDragStart: DragDropEvents<
      Draggable,
      Droppable,
      DragDropManager
    >["beforedragstart"] = React.useCallback(
      (event) => {
        const isResizingTop = calendar.getIsResizingTop();
        const isResizingBottom = calendar.getIsResizingBottom();
        const selection = calendar.getSelection();

        if (isResizingTop || isResizingBottom || selection) {
          event.preventDefault();
        }
      },
      [calendar]
    );

    const onDragStart: DragDropEvents<
      Draggable,
      Droppable,
      DragDropManager
    >["dragstart"] = React.useCallback(
      (event) => {
        const calendarEvent = event.operation.source?.data as CalendarEvent;
        calendar.startDragging(calendarEvent);
      },
      [calendar]
    );

    const onDragMove: DragDropEvents<
      Draggable,
      Droppable,
      DragDropManager
    >["dragmove"] = React.useCallback(
      (event) => {
        const { operation } = event;
        const containerRect = containerRef.current!.getBoundingClientRect();
        const cardRect = operation.shape?.current.boundingRectangle as DOMRect;

        if (!containerRect || !cardRect) return;

        const calendarEvent = operation.source?.data as CalendarEvent;

        const { startAt, endAt } = computeDayEventBounds(
          calendarEvent,
          cardRect,
          containerRect,
          calendar
        );

        calendar.updateDragging({ ...calendarEvent, startAt, endAt });
      },
      [calendar]
    );

    const onDragEnd: DragDropEvents<
      Draggable,
      Droppable,
      DragDropManager
    >["dragend"] = React.useCallback(
      (event) => {
        const { operation } = event;
        const containerRect = containerRef.current!.getBoundingClientRect();
        const cardRect = operation.shape?.current.boundingRectangle as DOMRect;

        if (!containerRect || !cardRect) return;

        const calendarEvent = operation.source?.data as CalendarEvent;

        const { startAt, endAt } = computeDayEventBounds(
          calendarEvent,
          cardRect,
          containerRect,
          calendar
        );

        // Prevent updating the event if the startAt and endAt are the same
        if (
          startAt.getTime() === calendarEvent.startAt.getTime() &&
          endAt.getTime() === calendarEvent.endAt.getTime()
        ) {
          calendar.stopDragging();
          return;
        }

        calendar.updateEvent({ ...calendarEvent, startAt, endAt });
        calendar.stopDragging();
      },
      [calendar]
    );

    return (
      <div ref={containerRef} className="relative h-full w-full">
        <DragDropProvider
          sensors={sensors}
          onBeforeDragStart={onBeforeDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          modifiers={[
            RestrictToElement.configure({
              element: () => containerRef.current
            })
          ]}
        >
          {children}
        </DragDropProvider>
      </div>
    );
  }
);
CalendarDayDndProvider.displayName = "CalendarDayDndProvider";

export { CalendarDayDndProvider };
