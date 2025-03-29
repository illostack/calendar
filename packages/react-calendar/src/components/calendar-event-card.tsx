"use client";

import { cn } from "@illostack/ui";
import * as React from "react";

import { formatDate } from "../lib/time";
import { CalendarEvent, CalendarEventWithPosition } from "../types";
import {
  useIsActiveEvent,
  useIsCuttedEvent,
  useIsDraggingEvent,
  useIsResizingEvent
} from "./calendar";

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
  date: Date;
  event: CalendarEvent & Partial<CalendarEventWithPosition>;
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
      date,
      event,
      className,
      disabledDrag,
      disabledResize,
      resizeOrientation = "vertical",
      ...props
    },
    ref
  ) => {
    const isCutted = useIsCuttedEvent(event);
    const isDragging = useIsDraggingEvent(event);
    const isResizing = useIsResizingEvent(event);
    const isActive = useIsActiveEvent(event);

    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative right-0 z-[1] select-none p-px",
          isDragging && "opacity-50",
          isResizing && "pointer-events-none hidden",
          isCutted && "pointer-events-none opacity-30",
          isActive && "z-[2]",
          className
        )}
        style={{
          position: event.position,
          top: event.top,
          left: event.left,
          height: event.height
        }}
        draggable="true"
        aria-label={event.summary || "(Untitled)"}
        data-event-id={event.id}
        data-event-date={formatDate(date)}
        data-event-state={isActive ? "active" : "inactive"}
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
