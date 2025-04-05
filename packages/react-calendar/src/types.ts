import { CALENDAR_COLORS } from "./lib/calendar";

export type CalendarWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CalendarHours =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

export type CalendarTranslations = {
  calendar: {
    days: {
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
    };
    months: {
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      11: string;
    };
  };
  literals: {
    day: string;
    days: string;
    week: string;
    month: string;
    year: string;
    today: string;
    previous: string;
    next: string;
    range: string;
    more: string;
    "go-to": string;
  };
  form: {
    save: string;
  };
  action: {
    "create-event": string;
    "update-event": string;
    "delete-event": string;
    "duplicate-event": string;
    "copy-event": string;
    "cut-event": string;
    "paste-event": string;
    undo: string;
  };
  message: {
    "event-created": string;
    "event-updated": string;
    "event-deleted": string;
    "event-restored": string;
    "event-duplicated": string;
    "event-copied": string;
    "event-cutted": string;
    "event-pasted": string;
    "event-not-found": string;
  };
};
export type CalendarFormatters = {
  time: (date: Date) => string;
  date: (date: Date) => string;
  dateTime: (date: Date) => string;
  week: (date: Date) => string;
  month: (date: Date) => string;
  year: (date: Date) => string;
  weekDayName: (date: Date) => string;
  weekDay: (date: Date) => string;
  monthDay: (date: Date) => string;
  range: (start: Date, end: Date) => string;
};

export type ViewDate = {
  date: Date;
  isOutside: boolean;
};

export type CalendarViewId = string;
export type CalendarViewMeta = Record<string, unknown>;
export type CalendarViewConfiguration = Record<string, unknown>;
export type CalendarViewConfigureFn<
  TView extends CalendarViewId,
  TViewMeta extends CalendarViewMeta,
  TViewConfiguration extends CalendarViewConfiguration
> = (
  configuration: TViewConfiguration
) => CalendarView<TView, TViewMeta, CalendarViewConfiguration>;

export type CalendarView<
  TView extends CalendarViewId,
  TViewMeta extends CalendarViewMeta,
  TViewConfiguration extends CalendarViewConfiguration
> = {
  id: TView;
  compositeId?: () => string;
  content: React.ElementType;
  viewDatesFn: (date: Date, weekStartsOn: CalendarWeekStartsOn) => ViewDate[];
  increaseFn: (date: Date) => Date;
  decreaseFn: (date: Date) => Date;
  meta: TViewMeta;
  configure: CalendarViewConfigureFn<TView, TViewMeta, TViewConfiguration>;
};

export type CalendarSelection = {
  startAt: Date;
  endAt: Date;
};

export type CalendarSection = {
  startAt: Date;
  endAt: Date;
};

export type Creator = {
  email: string;
  self: boolean;
};

export type Organizer = {
  email: string;
  self: boolean;
};

export type DateTime = {
  dateTime: string;
  timeZone: string;
};

export type Reminders = {
  useDefault: boolean;
};

export type GoogleCalendarEvent = {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  creator: Creator;
  organizer: Organizer;
  start: DateTime;
  end: DateTime;
  iCalUID: string;
  sequence: number;
  guestsCanModify: boolean;
  reminders: Reminders;
  eventType: string;
  accountId: string;
  calendarId: string;
  provider: string;
};

export type CalendarEvent<
  TEvent extends CalendarProvidedEvent = CalendarProvidedEvent
> = {
  id: string;
  summary: string;
  startAt: Date;
  endAt: Date;
  color?: (typeof CALENDAR_COLORS)[number];
  provider?: string;
} & Omit<TEvent, "id" | "summary" | "startAt" | "endAt" | "color"> &
  Partial<GoogleCalendarEvent>;

export type CalendarEventOverlap = {
  overlap: number;
};

export type CalendarEventWithOverlap<
  TEvent extends CalendarProvidedEvent = CalendarProvidedEvent
> = CalendarEvent<TEvent> & CalendarEventOverlap;

export type CalendarProvidedEvent = {
  id: string;
  summary: string;
  startAt: string | Date;
  endAt:
    | string
    | Date
    | {
        dateTime: string;
        timeZone: string;
      };
  color?: (typeof CALENDAR_COLORS)[number];
  [key: string]: unknown;
};

// =================== INTERFACES DE CONTEXTO ===================

export interface CalendarState<
  TEvent extends CalendarProvidedEvent,
  TViews extends CalendarView<
    CalendarViewId,
    CalendarViewMeta,
    CalendarViewConfiguration
  >[]
> {
  events: CalendarEvent<TEvent>[];

  // Date configuration
  date: Date;
  dates: ViewDate[];
  weekStartsOn: CalendarWeekStartsOn;
  defaultEventDuration: number;

  // View configuration
  view: TViews[number]["id"];
  views: TViews;
  currentView: CalendarView<
    TViews[number]["id"],
    TViews[number]["meta"],
    Parameters<TViews[number]["configure"]>[0]
  >;
  viewRef: React.RefObject<HTMLDivElement | null>;

  // Formatters
  formatters: CalendarFormatters;

  // Translations
  translations: CalendarTranslations;

  // Other configurations
  formView: "dialog" | "sheet";

  // Layout configuration
  layout: {
    rowHeight: number;
    minutesPerRow: number;
    rowsPerHour: number;
    totalRows: number;
    startHour: CalendarHours;
    endHour: CalendarHours;
    endOffset: number;
    calendarHeight: number;
    hours: number[];
    disableAnimation: boolean;
  };

  // Device configuration
  device: {
    modifierKeyPrefix: string;
  };

  // Copy/Cut feature
  cuttedEvent: CalendarEvent<TEvent> | null;
  copiedEvent: CalendarEvent<TEvent> | null;

  // Drag feature
  isDragging: boolean;
  draggingEvent: CalendarEvent<TEvent> | null;

  // Resize feature
  isResizingTop: boolean;
  isResizingBottom: boolean;
  resizingEvent: CalendarEvent<TEvent> | null;

  // Selection feature
  isSelecting: boolean;
  selection: CalendarSelection | null;

  // Activation feature
  activeSection: CalendarSection | null;
  activeEvent: CalendarEvent<TEvent> | null;
}

export interface CalendarApi<
  TEvent extends CalendarProvidedEvent,
  TViews extends CalendarView<
    CalendarViewId,
    CalendarViewMeta,
    CalendarViewConfiguration
  >[]
> {
  // Utils
  useWatch: <TSelected = CalendarState<TEvent, TViews>>(
    selector?: (state: CalendarState<TEvent, TViews>) => TSelected
  ) => TSelected;
  useEffect: <TSelected = CalendarState<TEvent, TViews>>(
    selector: (state: CalendarState<TEvent, TViews>) => TSelected,
    effect: (
      state: CalendarState<TEvent, TViews>,
      prevState: CalendarState<TEvent, TViews>
    ) => (() => void) | void
  ) => void;
  update: (
    updater: (
      prevState: CalendarState<TEvent, TViews>
    ) => CalendarState<TEvent, TViews>
  ) => void;

  // View feature
  getView: () => CalendarState<TEvent, TViews>["view"];
  getViews: () => CalendarState<TEvent, TViews>["views"];
  getCurrentView: () => CalendarState<TEvent, TViews>["currentView"];
  getViewMeta: (viewId: CalendarViewId) => CalendarViewMeta;
  changeView: (
    viewId: CalendarViewId,
    viewConfiguration?: CalendarViewConfiguration
  ) => void;
  viewRef: CalendarState<TEvent, TViews>["viewRef"];

  // Date feature
  getDate: () => CalendarState<TEvent, TViews>["date"];
  getDates: () => CalendarState<TEvent, TViews>["dates"];
  getWeekStartsOn: () => CalendarState<TEvent, TViews>["weekStartsOn"];
  getDefaultEventDuration: () => CalendarState<
    TEvent,
    TViews
  >["defaultEventDuration"];
  changeDate: (
    date: Date,
    view?: CalendarViewId,
    viewConfiguration?: CalendarViewConfiguration
  ) => void;
  goToday: () => void;
  increaseDate: () => void;
  decreaseDate: () => void;

  // Event feature
  getEvents: () => CalendarState<TEvent, TViews>["events"];
  getEvent: (eventId: string) => CalendarEvent<TEvent> | undefined;
  addEvent: (event: CalendarEvent<TEvent>) => void;
  restoreEvent: (event: CalendarEvent<TEvent>) => void;
  removeEvent: (eventId: string) => void;
  updateEvent: (event: CalendarEvent<TEvent>) => void;
  duplicateEvent: (eventId: string) => void;
  changeEventColor: (
    eventId: string,
    color: CalendarEvent<TEvent>["color"]
  ) => void;
  useViewEvents: () => CalendarEventWithOverlap<TEvent>[];
  useDayEvents: (date: Date) => CalendarEvent<TEvent>[];
  useViewAnimation: () => void;
  useViewAutoScroll: () => void;

  // Drag feature
  getIsDragging: () => CalendarState<TEvent, TViews>["isDragging"];
  getDraggingEvent: () => CalendarState<TEvent, TViews>["draggingEvent"];
  startDragging: (event: CalendarEvent<TEvent>) => void;
  updateDragging: (event: CalendarEvent<TEvent>) => void;
  stopDragging: () => void;
  useIsDraggingEvent: (eventId: string) => boolean;

  // Resize feature
  getIsResizingTop: () => CalendarState<TEvent, TViews>["isResizingTop"];
  getIsResizingBottom: () => CalendarState<TEvent, TViews>["isResizingBottom"];
  getResizingEvent: () => CalendarState<TEvent, TViews>["resizingEvent"];
  startResizingTop: (event: CalendarEvent<TEvent>) => void;
  startResizingBottom: (event: CalendarEvent<TEvent>) => void;
  updateResizing: (event: CalendarEvent<TEvent>) => void;
  stopResizing: () => void;
  useIsResizingEvent: (eventId: string) => boolean;

  // Selection feature
  getIsSelecting: () => CalendarState<TEvent, TViews>["isSelecting"];
  getSelection: () => CalendarState<TEvent, TViews>["selection"];
  startSelection: (selection: CalendarSelection | null) => void;
  updateSelection: (selection: CalendarSelection) => void;
  stopSelection: () => void;
  clearSelection: () => void;

  // Active event feature
  getActiveEvent: () => CalendarState<TEvent, TViews>["activeEvent"];
  activateEvent: (eventId: string) => void;
  clearActiveEvent: () => void;
  useActiveEventKeyboardEvents: () => void;
  useIsActiveEvent: (eventId: string) => boolean;

  // Active section feature
  getActiveSection: () => CalendarState<TEvent, TViews>["activeSection"];
  activateSection: (section: CalendarSection) => void;
  clearActiveSection: () => void;

  // Copy/Cut feature
  getCuttedEvent: () => CalendarState<TEvent, TViews>["cuttedEvent"];
  getCopiedEvent: () => CalendarState<TEvent, TViews>["copiedEvent"];
  cutEvent: (eventId: string) => void;
  useIsCuttedEvent: (eventId: string) => boolean;
  copyEvent: (eventId: string) => void;
  pasteEvent: ({ startAt }: { startAt: Date }) => void;

  // Translations feature
  getTranslations: () => CalendarState<TEvent, TViews>["translations"];

  // Formatter feature
  getFormatters: () => CalendarState<TEvent, TViews>["formatters"];

  // Layout
  getLayout: () => CalendarState<TEvent, TViews>["layout"];

  // Device feature
  getDevice: () => CalendarState<TEvent, TViews>["device"];

  // Form feature
  getFormView: () => CalendarState<TEvent, TViews>["formView"];

  openCreationForm: (
    event: Partial<CalendarEvent<TEvent>>,
    onClose?: () => void
  ) => void;
  openUpdateForm: (event: string, onClose?: () => void) => void;
}

export interface CalendarOptions<
  TEvent extends CalendarProvidedEvent,
  TViews extends CalendarView<
    CalendarViewId,
    CalendarViewMeta,
    CalendarViewConfiguration
  >[]
> {
  /**
   * Events
   * @default []
   */
  events?: TEvent[];
  initialDate?: Date;
  /**
   * Start hour
   * @default 0
   */
  startHour?: CalendarHours;
  /**
   * End hour
   * @default 23
   */
  endHour?: CalendarHours;
  /**
   * Default event duration in minutes
   * @default 60
   */
  defaultEventDuration?: number;

  initialView: TViews[number]["id"];
  views: TViews;
  /**
   * Row height in pixels
   * @default 16
   */
  rowHeight?: number;
  /**
   * Minutes per row
   * @default 15
   */
  minutesPerRow?: number;
  /**
   * Locale
   * @default "en-US"
   */
  locale?: string;
  /**
   * Week starts on
   * @default 0
   */
  weekStartsOn?: CalendarWeekStartsOn;
  formatters?: Partial<CalendarState<TEvent, TViews>["formatters"]>;
  translations?: Partial<CalendarTranslations>;
  /**
   * Form view
   * @default "dialog"
   */
  formView?: "dialog" | "sheet";
  /**
   * Disable animation
   * @default false
   */
  disableAnimation?: boolean;

  onViewChange?: (
    view: CalendarView<
      TViews[number]["id"],
      TViews[number]["meta"],
      Parameters<TViews[number]["configure"]>[0]
    >
  ) => void;
  onDateChange?: (date: Date) => void;
  onEventCreate?: (event: CalendarEvent<TEvent>) => void;
  onEventUpdate?: (event: CalendarEvent<TEvent>) => void;
  onEventDelete?: (event: CalendarEvent<TEvent>) => void;
  onRestoreEvent?: (event: CalendarEvent<TEvent>) => void;
  onEventDuplicate?: (event: CalendarEvent<TEvent>) => void;
  onEventCopy?: (event: CalendarEvent<TEvent>) => void;
  onEventCut?: (event: CalendarEvent<TEvent>) => void;
  onEventPaste?: (event: CalendarEvent<TEvent>) => void;
}
