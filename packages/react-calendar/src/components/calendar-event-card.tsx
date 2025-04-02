"use client";

import { cn } from "@illostack/react-calendar-ui";
import * as React from "react";

import { CalendarEvent } from "../types";
import { useCalendar } from "./calendar";

interface CalendarEventCardResizeHandleProps {
  event: CalendarEvent;
  orientation?: "vertical" | "horizontal";
}

const CalendarEventCardResizeHandle: React.FC<
  CalendarEventCardResizeHandleProps
> = ({ event, orientation }) => {
  return (
    <React.Fragment>
      <div
        data-resize-handler="top"
        data-resize-top-event-id={event.id}
        className={cn(
          "hover:bg-primary/10 absolute rounded-full",
          orientation === "horizontal" &&
            "inset-y-2 left-0 w-1 cursor-w-resize",
          orientation === "vertical" && "inset-x-2 top-0 h-1 cursor-n-resize"
        )}
      />
      <div
        data-resize-handler="bottom"
        data-resize-bottom-event-id={event.id}
        className={cn(
          "hover:bg-primary/10 absolute rounded-full",
          orientation === "horizontal" &&
            "inset-y-2 right-0 w-1 cursor-e-resize",
          orientation === "vertical" && "inset-x-2 bottom-0 h-1 cursor-s-resize"
        )}
      />
    </React.Fragment>
  );
};

interface CalendarEventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  event: CalendarEvent;
  disabledDrag?: boolean;
  disabledResize?: boolean;
  resizeOrientation?: "vertical" | "horizontal";
}

const CalendarEventCard = React.forwardRef<
  HTMLDivElement,
  CalendarEventCardProps
>(
  (
    {
      children,
      event,
      className,
      disabledDrag,
      disabledResize,
      resizeOrientation = "vertical",
      ...props
    },
    ref
  ) => {
    const calendar = useCalendar();
    const isCutted = calendar.useIsCuttedEvent(event.id);
    const isDragging = calendar.useIsDraggingEvent(event.id);
    const isResizing = calendar.useIsResizingEvent(event.id);
    const isActive = calendar.useIsActiveEvent(event.id);

    return (
      <div
        ref={ref}
        tabIndex={0}
        className={cn(
          "group pointer-events-auto relative select-none p-px",
          isDragging && "z-10 opacity-0",
          isResizing && "hidden",
          isCutted && "pointer-events-none opacity-30",
          isActive && "z-10",
          className
        )}
        draggable="true"
        aria-label={event.summary || "(Untitled)"}
        data-event-id={event.id}
        data-event-state={
          isActive || isDragging || isResizing ? "active" : "inactive"
        }
        {...props}
      >
        {children}
        {!disabledResize && (
          <CalendarEventCardResizeHandle
            event={event}
            orientation={resizeOrientation}
          />
        )}
      </div>
    );
  }
);

CalendarEventCard.displayName = "CalendarEventCard";

export { CalendarEventCard, CalendarEventCardResizeHandle };
