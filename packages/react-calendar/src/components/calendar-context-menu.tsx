"use client";

import {
  CalendarPlusIcon,
  CheckIcon,
  ClipboardIcon,
  cn,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  CopyIcon,
  CopyPlusIcon,
  PencilIcon,
  RadioGroup,
  RadioGroupItem,
  SquareDashedIcon,
  TrashIcon
} from "@illostack/react-calendar-ui";
import * as React from "react";

import { CALENDAR_COLORS } from "../lib/calendar";
import { addMinutes } from "../lib/time";
import { useCalendar } from "./calendar";

interface CalendarContextMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CalendarContextMenu: React.FC<CalendarContextMenuProps> = ({
  children
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const calendar = useCalendar();

  const { isEnabledPaste } = calendar.useWatch((s) => ({
    isEnabledPaste: Boolean(s.copiedEvent || s.cuttedEvent)
  }));
  const activateEvent = calendar.useWatch(
    (s) => s.activeEvent && s.events.find((e) => e.id === s.activeEvent?.id)
  );

  const handlePaste = React.useCallback(() => {
    const activeSection = calendar.getActiveSection();
    const copiedEvent = calendar.getCopiedEvent();
    const cuttedEvent = calendar.getCuttedEvent();

    if (!activeSection || !(copiedEvent || cuttedEvent)) {
      return;
    }

    calendar.pasteEvent({ startAt: activeSection.startAt });
  }, [calendar]);

  const handleCreate = React.useCallback(() => {
    const activeSection = calendar.getActiveSection();

    if (!activeSection) {
      return;
    }

    const startAt = activeSection.startAt;
    const defaultDuration = calendar.getDefaultEventDuration();
    const endAt = addMinutes(startAt, defaultDuration);

    calendar.openCreationForm({ startAt, endAt });
  }, [calendar]);

  const translations = calendar.getTranslations();
  const device = calendar.getDevice();

  return (
    <ContextMenu
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          calendar.clearActiveSection();
          calendar.clearActiveEvent();
        }
      }}
    >
      <ContextMenuTrigger ref={ref} asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64" container={ref.current!}>
        {activateEvent ? (
          <React.Fragment>
            <div className="p-1.5">
              <RadioGroup
                onValueChange={(value: (typeof CALENDAR_COLORS)[number]) => {
                  calendar.changeEventColor(activateEvent.id, value);
                }}
                defaultValue={activateEvent.color}
                className="flex flex-wrap gap-1.5"
              >
                {CALENDAR_COLORS.map((color) => (
                  <div key={color} className="flex items-center space-y-0">
                    <RadioGroupItem
                      id={color}
                      value={color}
                      className="hidden"
                    />
                    <label
                      htmlFor={color}
                      className={cn(
                        "flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm border transition-transform duration-75 hover:scale-110",
                        activateEvent.color === color && "scale-110",
                        color === "green" && "bg-green-500",
                        color === "blue" && "bg-blue-500",
                        color === "red" && "bg-red-500",
                        color === "yellow" && "bg-yellow-500",
                        color === "purple" && "bg-purple-500",
                        color === "pink" && "bg-pink-500",
                        color === "indigo" && "bg-indigo-500",
                        color === "cyan" && "bg-cyan-500"
                      )}
                    >
                      {activateEvent.color === color && (
                        <CheckIcon className="h-3 w-3 text-white" />
                      )}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <ContextMenuSeparator />
            <ContextMenuItem
              onSelect={() => {
                calendar.openUpdateForm(activateEvent.id);
              }}
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              {translations.action["update-event"]}
              <ContextMenuShortcut>{`${device.modifierKeyPrefix} E`}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => calendar.cutEvent(activateEvent.id)}
            >
              <SquareDashedIcon className="mr-2 h-4 w-4" />
              {translations.action["cut-event"]}
              <ContextMenuShortcut>{`${device.modifierKeyPrefix} X`}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => calendar.copyEvent(activateEvent.id)}
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              {translations.action["copy-event"]}
              <ContextMenuShortcut>{`${device.modifierKeyPrefix} C`}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => calendar.duplicateEvent(activateEvent.id)}
            >
              <CopyPlusIcon className="mr-2 h-4 w-4" />
              {translations.action["duplicate-event"]}
              <ContextMenuShortcut>{`${device.modifierKeyPrefix} D`}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onSelect={() => calendar.removeEvent(activateEvent.id)}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              {translations.action["delete-event"]}
              <ContextMenuShortcut>{"⌫"}</ContextMenuShortcut>
            </ContextMenuItem>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ContextMenuItem onSelect={handleCreate}>
              <CalendarPlusIcon className="mr-2 h-4 w-4" />
              {translations.action["create-event"]}
              <ContextMenuShortcut>{"C"}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled={!isEnabledPaste} onSelect={handlePaste}>
              <ClipboardIcon className="mr-2 h-4 w-4" />
              {translations.action["paste-event"]}
              <ContextMenuShortcut>{`${device.modifierKeyPrefix} V`}</ContextMenuShortcut>
            </ContextMenuItem>
          </React.Fragment>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
CalendarContextMenu.displayName = "CalendarContextMenu";

export { CalendarContextMenu };
