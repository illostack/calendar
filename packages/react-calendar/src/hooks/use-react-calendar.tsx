"use client";

import { showDialog, showSheet, toast } from "@illostack/react-calendar-ui";
import { createStore, useStore, useStoreEffect } from "@illostack/react-store";
import * as React from "react";

import { CalendarEventForm } from "../components/calendar-event-form";
import {
  CALENDAR_COLORS,
  getModifierKeyPrefix,
  normalizeEvents,
  resolveFormatters,
  resolveLayout,
  resolveShortcuts,
  resolveTranslations,
  sortEvents
} from "../lib/calendar";
import { formatDate, formatTime, isDatesBetween } from "../lib/time";
import { generateUUID } from "../lib/utils";
import {
  CalendarApi,
  CalendarEvent,
  CalendarEventWithOverlap,
  CalendarOptions,
  CalendarProvidedEvent,
  CalendarState,
  CalendarView,
  CalendarViewConfiguration,
  CalendarViewId,
  CalendarViewMeta
} from "../types";

const DEFAULT_LOCALE = "en-US";
const DEFAULT_WEEK_STARTS_ON = 0;
const DEFAULT_ROW_HEIGHT = 16;
const DEFAULT_MINUTES_PER_ROW = 15;
const DEFAULT_START_HOUR = 0;
const DEFAULT_END_HOUR = 23;
const DEFAULT_DEFAULT_EVENT_DURATION = 60;
const DEFAULT_FORM_VIEW = "dialog";

interface UseCalendarOptions<
  TEvent extends CalendarProvidedEvent,
  TViews extends CalendarView<
    CalendarViewId,
    CalendarViewMeta,
    CalendarViewConfiguration
  >[]
> extends CalendarOptions<TEvent, TViews> {}

export const useReactCalendar = <
  TEvent extends CalendarProvidedEvent,
  TViews extends CalendarView<
    CalendarViewId,
    CalendarViewMeta,
    CalendarViewConfiguration
  >[]
>({
  events = [],
  locale = DEFAULT_LOCALE,
  weekStartsOn = DEFAULT_WEEK_STARTS_ON,
  formatters = {},
  initialView,
  views,
  initialDate = new Date(),
  formView = DEFAULT_FORM_VIEW,
  disableAnimation = false,
  rowHeight = DEFAULT_ROW_HEIGHT,
  minutesPerRow = DEFAULT_MINUTES_PER_ROW,
  startHour = DEFAULT_START_HOUR,
  endHour = DEFAULT_END_HOUR,
  defaultEventDuration = DEFAULT_DEFAULT_EVENT_DURATION,
  translations = {},

  onViewChange,
  onDateChange,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onRestoreEvent,
  onEventDuplicate,
  onEventCopy,
  onEventCut,
  onEventPaste
}: UseCalendarOptions<TEvent, TViews>) => {
  const viewRef = React.useRef<HTMLDivElement>(null);

  const storeRef = React.useRef(
    (() => {
      const initView = views.find((v) => v.id === initialView) ?? views[0]!;

      return createStore<CalendarState<TEvent, TViews>>({
        events: normalizeEvents(events),
        date: initialDate,
        dates: initView.viewDatesFn(initialDate, weekStartsOn),
        currentView: initView,
        viewRef,
        weekStartsOn,
        view: initialView,
        views,
        formView,
        layout: resolveLayout({
          rowHeight,
          minutesPerRow,
          startHour,
          endHour,
          disableAnimation
        }),
        device: {
          modifierKeyPrefix: getModifierKeyPrefix()
        },
        cuttedEvent: null,
        copiedEvent: null,
        formatters: resolveFormatters(formatters, locale),
        defaultEventDuration,
        translations: resolveTranslations(translations),
        draggingEvent: null,
        isDragging: false,
        isResizingTop: false,
        isResizingBottom: false,
        resizingEvent: null,
        isSelecting: false,
        selection: null,
        activeSection: null,
        activeEvent: null
      });
    })()
  );

  const calendarRef = React.useRef<CalendarApi<TEvent, TViews>>({
    // Utils
    useWatch: (selector) => {
      return useStore(storeRef.current, selector);
    },
    useEffect: (selector, effect) => {
      return useStoreEffect(storeRef.current, selector, effect);
    },
    update: storeRef.current.update,

    // View feature
    getView: () => storeRef.current.state.view,
    getViews: () => storeRef.current.state.views,
    getCurrentView: () => storeRef.current.state.currentView,
    getViewMeta: (viewId) =>
      storeRef.current.state.views.find((v) => v.id === viewId)!.meta,
    changeView: (viewId, viewConfiguration) => {
      let view = storeRef.current.state.views.find((v) => v.id === viewId)!;

      if (viewConfiguration) {
        view = view?.configure(viewConfiguration);
      }

      storeRef.current.update((state) => ({
        ...state,
        view: viewId,
        dates: view.viewDatesFn(state.date, state.weekStartsOn),
        currentView: view,
        date: state.date
      }));
      onViewChange?.(view);
    },
    viewRef: storeRef.current.state.viewRef,

    // Date feature
    getDate: () => storeRef.current.state.date,
    getDates: () => storeRef.current.state.dates,
    getWeekStartsOn: () => storeRef.current.state.weekStartsOn,
    getDefaultEventDuration: () => storeRef.current.state.defaultEventDuration,
    changeDate: (date, viewId, viewConfiguration) => {
      let view = (
        viewId !== undefined
          ? storeRef.current.state.views.find((v) => v.id === viewId)
          : storeRef.current.state.currentView
      ) as CalendarView<
        TViews[number]["id"],
        TViews[number]["meta"],
        Parameters<TViews[number]["configure"]>[0]
      >;

      if (viewConfiguration !== undefined) {
        view = view?.configure(viewConfiguration);
      }

      storeRef.current.update((state) => ({
        ...state,
        date: date,
        dates: view.viewDatesFn(date, state.weekStartsOn),
        view: viewId ?? state.view,
        currentView: view
      }));
      onDateChange?.(date);
    },
    goToday: () => calendarRef.current.changeDate(new Date()),
    increaseDate: () => {
      const newDate = storeRef.current.state.currentView.increaseFn(
        storeRef.current.state.date
      );
      calendarRef.current.changeDate(newDate);
    },
    decreaseDate: () => {
      const newDate = storeRef.current.state.currentView.decreaseFn(
        storeRef.current.state.date
      );
      calendarRef.current.changeDate(newDate);
    },

    // Event feature
    getEvents: () => storeRef.current.state.events,
    getEvent: (eventId) =>
      storeRef.current.state.events.find((event) => event.id === eventId),
    addEvent: (event) => {
      storeRef.current.update((state) => ({
        ...state,
        events: sortEvents([...state.events, event])
      }));
      onEventCreate?.(event);
    },
    restoreEvent: (event) => {
      storeRef.current.update((state) => ({
        ...state,
        events: sortEvents([...state.events, event])
      }));
      onRestoreEvent?.(event);
    },
    removeEvent: (eventId) => {
      const event = storeRef.current.state.events.find((e) => e.id === eventId);
      if (!event) return;

      storeRef.current.update((state) => ({
        ...state,
        events: sortEvents(state.events.filter((e) => e.id !== eventId))
      }));

      onEventDelete?.(event);

      toast.info(storeRef.current.state.translations.message["event-deleted"], {
        action: {
          label: storeRef.current.state.translations.action["undo"],
          onClick: () => calendarRef.current.restoreEvent(event)
        }
      });
    },
    updateEvent: (event) => {
      storeRef.current.update((state) => ({
        ...state,
        events: sortEvents(
          state.events.map((prevEvent) =>
            prevEvent.id === event.id ? event : prevEvent
          )
        )
      }));
      onEventUpdate?.(event);
    },
    duplicateEvent: (eventId) => {
      const event = storeRef.current.state.events.find((e) => e.id === eventId);
      if (!event) return;

      const newEvent = { ...event, id: generateUUID() };
      calendarRef.current.addEvent(newEvent);
      onEventDuplicate?.(newEvent);
      toast.info(storeRef.current.state.translations.action["duplicate-event"]);
    },
    changeEventColor: (eventId, color) => {
      const event = storeRef.current.state.events.find((e) => e.id === eventId);
      if (!event) return;

      calendarRef.current.updateEvent({ ...event, color });
    },
    useViewEvents: () => {
      const dates = useStore(storeRef.current, (s) => s.dates);
      const startAt = dates[0]?.date!;
      const endAt = dates[dates.length - 1]?.date!;

      const events = useStore(storeRef.current, (s) =>
        s.events.filter((event) =>
          isDatesBetween(
            new Date(new Date(startAt).setHours(0, 0, 0, 0)),
            new Date(new Date(endAt).setHours(23, 59, 59, 999)),
            event.startAt,
            event.endAt
          )
        )
      );

      return React.useMemo(
        () =>
          events.reduce<CalendarEventWithOverlap<TEvent>[]>((acc, event) => {
            const prevEvent = acc[acc.length - 1];

            // I think this is one of the most efficient ways to calculate the overlap
            // and the left position of an event
            if (
              prevEvent &&
              prevEvent.startAt.getTime() <= event.startAt.getTime() &&
              prevEvent.endAt.getTime() > event.startAt.getTime()
            ) {
              const overlap = prevEvent.overlap + 1;

              return [
                ...acc,
                {
                  ...event,
                  overlap
                }
              ];
            }

            return [
              ...acc,
              {
                ...event,
                overlap: 0
              }
            ];
          }, []),
        [events]
      );
    },
    useDayEvents: (date: Date) => {
      const startAt = new Date(new Date(date).setHours(0, 0, 0, 0));
      const endAt = new Date(new Date(date).setHours(23, 59, 59, 999));
      return useStore(storeRef.current, (s) =>
        s.events.filter((event) =>
          isDatesBetween(startAt, endAt, event.startAt, event.endAt)
        )
      );
    },
    useViewAnimation: () => {
      return useStoreEffect(
        storeRef.current,
        (s) => s.date,
        (state, previousState) => {
          if (storeRef.current.state.layout.disableAnimation) {
            return;
          }

          const view = storeRef.current.state.viewRef.current;

          if (!view) {
            return;
          }

          if (formatDate(state.date) === formatDate(previousState.date)) {
            return;
          }

          if (state.date > previousState.date) {
            view.classList.add(
              "animate-in",
              "slide-in-from-right-1/4",
              "fade-in",
              "duration-300"
            );
            const timeout = setTimeout(() => {
              view.classList.remove(
                "animate-in",
                "slide-in-from-right-1/4",
                "fade-in",
                "duration-300"
              );
            }, 300);

            return () => clearTimeout(timeout);
          }

          if (state.date < previousState.date) {
            view.classList.add(
              "animate-in",
              "slide-in-from-left-1/4",
              "fade-in",
              "duration-300"
            );
            const timeout = setTimeout(() => {
              view.classList.remove(
                "animate-in",
                "slide-in-from-left-1/4",
                "fade-in",
                "duration-300"
              );
            }, 300);

            return () => clearTimeout(timeout);
          }
          return;
        }
      );
    },
    useViewAutoScroll: () => {
      return useStoreEffect(
        storeRef.current,
        (s) =>
          s.isDragging ||
          s.isResizingTop ||
          s.isResizingBottom ||
          s.isSelecting,
        (state) => {
          const view = storeRef.current.state.viewRef.current;

          if (!view) {
            return;
          }

          if (
            !state.isDragging &&
            !state.isResizingTop &&
            !state.isResizingBottom &&
            !state.isSelecting
          ) {
            return;
          }

          const offset = 100;
          const scrollSpeed = 2;
          let scroll = window.scrollY;

          const handleMouseMove = (e: MouseEvent) => {
            const { clientY } = e;

            const top = view.offsetTop + offset;
            const bottom = window.innerHeight - offset;

            if (clientY < top) {
              const speed = scrollSpeed * Math.abs(clientY - top);

              scroll = Math.max(scroll - speed, 0);

              window.scrollTo({ top: scroll, behavior: "smooth" });
            } else if (clientY > bottom) {
              const speed = scrollSpeed * Math.abs(clientY - bottom);

              scroll = Math.min(scroll + speed, document.body.scrollHeight);

              window.scrollTo({ top: scroll, behavior: "smooth" });
            }
          };

          window.addEventListener("mousemove", handleMouseMove);
          window.addEventListener("dragover", handleMouseMove);

          return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("dragover", handleMouseMove);
          };
        }
      );
    },

    // Drag feature
    getIsDragging: () => storeRef.current.state.isDragging,
    getDraggingEvent: () => storeRef.current.state.draggingEvent,
    startDragging: (event) => {
      storeRef.current.update((s) => ({
        ...s,
        draggingEvent: event,
        isDragging: true,
        selection: null,
        isSelecting: false
      }));
    },
    updateDragging: (event) => {
      storeRef.current.update((s) => ({
        ...s,
        draggingEvent: event
      }));
    },
    stopDragging: () => {
      storeRef.current.update((s) => ({
        ...s,
        draggingEvent: null,
        isDragging: false
      }));
    },
    useIsDraggingEvent: (eventId: string) => {
      return useStore(storeRef.current, (s) => s.draggingEvent?.id === eventId);
    },

    // Resize feature
    getIsResizingTop: () => storeRef.current.state.isResizingTop,
    getIsResizingBottom: () => storeRef.current.state.isResizingBottom,
    getResizingEvent: () => storeRef.current.state.resizingEvent,
    startResizingTop: (resizingEvent) => {
      storeRef.current.update((state) => ({
        ...state,
        resizingEvent,
        isResizingTop: true,
        isResizingBottom: false
      }));
    },
    startResizingBottom: (resizingEvent) => {
      storeRef.current.update((state) => ({
        ...state,
        resizingEvent,
        isResizingTop: false,
        isResizingBottom: true
      }));
    },
    updateResizing: (resizingEvent) => {
      storeRef.current.update((state) => ({
        ...state,
        resizingEvent
      }));
    },
    stopResizing: () => {
      storeRef.current.update((state) => ({
        ...state,
        resizingEvent: null,
        isResizingTop: false,
        isResizingBottom: false
      }));
    },
    useIsResizingEvent: (eventId: string) => {
      return useStore(storeRef.current, (s) => s.resizingEvent?.id === eventId);
    },

    // Selection feature
    getIsSelecting: () => storeRef.current.state.isSelecting,
    getSelection: () => storeRef.current.state.selection,
    startSelection: (selection) => {
      storeRef.current.update((state) => ({
        ...state,
        selection,
        isSelecting: true
      }));
    },
    updateSelection: (selection) => {
      storeRef.current.update((state) => ({
        ...state,
        selection
      }));
    },
    stopSelection: () => {
      storeRef.current.update((state) => ({
        ...state,
        selection: null,
        isSelecting: false
      }));
    },
    clearSelection: () => {
      storeRef.current.update((state) => ({
        ...state,
        selection: null,
        isSelecting: false
      }));
    },

    // Active event feature
    getActiveEvent: () => storeRef.current.state.activeEvent,
    activateEvent: (eventId) => {
      const event = storeRef.current.state.events.find((e) => e.id === eventId);
      if (!event) return;
      storeRef.current.update((state) => ({
        ...state,
        activeEvent: event
      }));
    },
    clearActiveEvent: () => {
      storeRef.current.update((state) => ({
        ...state,
        activeEvent: null
      }));
    },
    useActiveEventKeyboardEvents: () => {
      return useStoreEffect(
        storeRef.current,
        (state) => state.activeEvent,
        (s) => {
          if (s.activeEvent) {
            const deleteEvent = storeRef.current.state.shortcuts.deleteEvent;
            const duplicateEvent =
              storeRef.current.state.shortcuts.duplicateEvent;
            const copyEvent = storeRef.current.state.shortcuts.copyEvent;
            const cutEvent = storeRef.current.state.shortcuts.cutEvent;

            const handler = (e: KeyboardEvent) => {
              // Delete event
              if (
                e.key === deleteEvent.key &&
                (deleteEvent.control ? e.ctrlKey : true) &&
                (deleteEvent.shift ? e.shiftKey : true) &&
                (deleteEvent.alt ? e.altKey : true)
              ) {
                e.preventDefault();
                calendarRef.current.removeEvent(s.activeEvent?.id!);
                return;
              }
              // Duplicate event
              if (
                e.key === duplicateEvent.key &&
                (duplicateEvent.control ? e.ctrlKey : true) &&
                (duplicateEvent.shift ? e.shiftKey : true) &&
                (duplicateEvent.alt ? e.altKey : true)
              ) {
                e.preventDefault();
                calendarRef.current.duplicateEvent(s.activeEvent?.id!);
                calendarRef.current.clearActiveEvent();
                return;
              }
              // Copy event
              if (
                e.key === copyEvent.key &&
                (copyEvent.control ? e.ctrlKey : true) &&
                (copyEvent.shift ? e.shiftKey : true) &&
                (copyEvent.alt ? e.altKey : true)
              ) {
                e.preventDefault();
                calendarRef.current.copyEvent(s.activeEvent?.id!);
                return;
              }
              // Cut event
              if (
                e.key === cutEvent.key &&
                (cutEvent.control ? e.ctrlKey : true) &&
                (cutEvent.shift ? e.shiftKey : true) &&
                (cutEvent.alt ? e.altKey : true)
              ) {
                e.preventDefault();
                calendarRef.current.cutEvent(s.activeEvent?.id!);
                return;
              }
            };
            window.addEventListener("keydown", handler);
            return () => window.removeEventListener("keydown", handler);
          }

          return;
        }
      );
    },
    useIsActiveEvent: (eventId: string) => {
      return useStore(storeRef.current, (s) => s.activeEvent?.id === eventId);
    },

    // Active section feature
    getActiveSection: () => storeRef.current.state.activeSection,
    activateSection: (section) => {
      storeRef.current.update((state) => ({
        ...state,
        activeSection: section
      }));
    },
    clearActiveSection: () => {
      storeRef.current.update((state) => ({
        ...state,
        activeSection: null
      }));
    },

    // Copy/Cut feature
    getCuttedEvent: () => storeRef.current.state.cuttedEvent,
    getCopiedEvent: () => storeRef.current.state.copiedEvent,
    copyEvent: (eventId) => {
      const event = storeRef.current.state.events.find((e) => e.id === eventId);
      if (!event) return;
      storeRef.current.update((state) => ({
        ...state,
        copiedEvent: event,
        cuttedEvent: null
      }));
      onEventCopy?.(event);
      toast.info(storeRef.current.state.translations.message["event-copied"]);
    },
    cutEvent: (eventId) => {
      const event = storeRef.current.state.events.find((e) => e.id === eventId);
      if (!event) return;

      storeRef.current.update((state) => ({
        ...state,
        cuttedEvent: event,
        copiedEvent: null
      }));
      onEventCut?.(event);
      toast.info(storeRef.current.state.translations.message["event-cutted"], {
        action: {
          label: storeRef.current.state.translations.action["undo"],
          onClick: () =>
            storeRef.current.update((state) => ({
              ...state,
              cuttedEvent: null
            }))
        }
      });
    },
    useIsCuttedEvent: (eventId: string) => {
      return useStore(storeRef.current, (s) => s.cuttedEvent?.id === eventId);
    },
    pasteEvent: ({ startAt }: { startAt: Date }) => {
      const { copiedEvent, cuttedEvent } = storeRef.current.state;
      if (copiedEvent) {
        const duration =
          copiedEvent.endAt.getTime() - copiedEvent.startAt.getTime();
        calendarRef.current.addEvent({
          ...copiedEvent,
          id: generateUUID(),
          startAt,
          endAt: new Date(startAt.getTime() + duration)
        });
        onEventPaste?.(copiedEvent);
        toast.info(storeRef.current.state.translations.message["event-pasted"]);
        return;
      }
      if (cuttedEvent) {
        const duration =
          cuttedEvent.endAt.getTime() - cuttedEvent.startAt.getTime();
        calendarRef.current.updateEvent({
          ...cuttedEvent,
          startAt,
          endAt: new Date(startAt.getTime() + duration)
        });
        onEventPaste?.(cuttedEvent);
        storeRef.current.update((state) => ({
          ...state,
          cuttedEvent: null
        }));
        toast.info(storeRef.current.state.translations.message["event-pasted"]);
      }
    },

    // Translations feature
    getTranslations: () => storeRef.current.state.translations,
    // Formatter feature
    getFormatters: () => storeRef.current.state.formatters,
    // Layout
    getLayout: () => storeRef.current.state.layout,
    // Device feature
    getDevice: () => storeRef.current.state.device,
    // Form feature
    getFormView: () => storeRef.current.state.formView,

    openCreationForm: (
      event: Partial<CalendarEvent<TEvent>>,
      onClose?: () => void
    ) => {
      const showFunc =
        storeRef.current.state.formView === "dialog" ? showDialog : showSheet;
      showFunc({
        className: "sm:max-w-xl",
        render: (close) => (
          <CalendarEventForm
            onSubmit={(values) => {
              const newEvent = {
                ...event,
                id: generateUUID(),
                summary: values.summary || "",
                startAt: new Date(`${values.startDate}T${values.startAt}:00`),
                endAt: new Date(`${values.endDate}T${values.endAt}:00`),
                color: values.color
              };
              calendarRef.current.addEvent(newEvent as CalendarEvent<TEvent>);
              toast(
                storeRef.current.state.translations.message["event-created"]
              );
              close();
            }}
            defaultValues={{
              summary: event.summary || "",
              startDate: formatDate(event.startAt ?? new Date()),
              startAt: formatTime(event.startAt ?? new Date()),
              endDate: formatDate(event.endAt ?? new Date()),
              endAt: formatTime(event.endAt ?? new Date()),
              color: CALENDAR_COLORS[0]
            }}
          />
        ),
        onClose
      });
    },
    openUpdateForm: (eventId, onClose) => {
      const event = storeRef.current.state.events.find((e) => e.id === eventId);
      if (!event) return;

      const showFunc =
        storeRef.current.state.formView === "dialog" ? showDialog : showSheet;
      showFunc({
        className: "sm:max-w-xl",
        render: (close) => (
          <CalendarEventForm
            onSubmit={(values) => {
              const updatedEvent = {
                ...event,
                summary: values.summary || "",
                startAt: new Date(`${values.startDate}T${values.startAt}:00`),
                endAt: new Date(`${values.endDate}T${values.endAt}:00`),
                color: values.color
              };
              calendarRef.current.updateEvent(updatedEvent);
              toast(
                storeRef.current.state.translations.message["event-updated"]
              );
              close();
            }}
            defaultValues={{
              summary: event.summary,
              startDate: formatDate(event.startAt ?? new Date()),
              startAt: formatTime(event.startAt ?? new Date()),
              endDate: formatDate(event.endAt ?? new Date()),
              endAt: formatTime(event.endAt ?? new Date()),
              color: event.color ?? CALENDAR_COLORS[0]
            }}
          />
        ),
        onClose
      });
    }
  });

  React.useEffect(() => {
    calendarRef.current.update((state) => ({
      ...state,
      events: normalizeEvents(events)
    }));
  }, [events]);

  return calendarRef.current;
};
