import { CalendarWeekStartsOn } from "../types";

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isDateBetween = (date: Date, startDate: Date, endDate: Date) => {
  return date > startDate && date < endDate;
};

const isDatesBetween = (
  dateStart: Date,
  dateEnd: Date,
  startDate: Date,
  endDate: Date
) => {
  return (
    (dateStart > startDate && dateStart < endDate) ||
    (dateEnd > startDate && dateEnd < endDate) ||
    (startDate > dateStart && startDate < dateEnd) ||
    (endDate > dateStart && endDate < dateEnd)
  );
};

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

const formatTime = (date: Date) => {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + minutes * 60000);

const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(date.getDate() + days);
  return copy;
};

const addWeeks = (date: Date, weeks: number) => {
  const copy = new Date(date);
  copy.setDate(date.getDate() + weeks * 7);
  return copy;
};

const addMonths = (date: Date, months: number) => {
  const copy = new Date(date);
  copy.setMonth(date.getMonth() + months);
  return copy;
};

const addYears = (date: Date, years: number) => {
  const copy = new Date(date);
  copy.setFullYear(date.getFullYear() + years);
  return copy;
};

const getDay = (date: Date) => date.getDay();

const startOfMonth = (date: Date) => {
  const copy = new Date(date);
  copy.setDate(1);
  return copy;
};

const endOfMonth = (date: Date) => {
  const copy = new Date(date);
  copy.setMonth(date.getMonth() + 1);
  copy.setDate(0);
  return copy;
};

const startOfWeek = (date: Date, weekStartsOn = 0) => {
  const copy = new Date(date);
  const diff = date.getDay() - weekStartsOn;
  const diffDays = diff < 0 ? 7 + diff : diff;
  copy.setDate(date.getDate() - diffDays);
  return copy;
};

const endOfWeek = (date: Date, weekStartsOn = 0) => {
  const copy = new Date(date);
  const diff = date.getDay() - weekStartsOn;
  const diffDays = diff < 0 ? 0 : 6 - diff;

  copy.setDate(date.getDate() + diffDays);
  return copy;
};

const startOfYear = (date: Date) => {
  const copy = new Date(date);
  copy.setMonth(0);
  copy.setDate(1);
  return copy;
};

const endOfYear = (date: Date) => {
  const copy = new Date(date);
  copy.setMonth(11);
  copy.setDate(31);
  return copy;
};

const getRangeDays = (date: Date, numOfDays: number) => {
  const start = new Date(date);
  const end = addDays(date, numOfDays - 1);

  const days: Date[] = [];

  let current = start;
  while (current <= end) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  return days;
};

const getWeekDays = (date: Date, weekStartsOn: CalendarWeekStartsOn = 0) => {
  const start = startOfWeek(date, weekStartsOn);
  const end = endOfWeek(date, weekStartsOn);

  const days: Date[] = [];

  let current = start;
  while (current <= end) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  return days;
};

const getMonthDays = (
  date: Date,
  showOutsideDays: boolean = true,
  weekStartsOn: CalendarWeekStartsOn = 0
) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const days: { date: Date; isOutside: boolean }[] = [];

  let current = start;

  const prevDays = (getDay(start) - weekStartsOn + 7) % 7;
  if (showOutsideDays) {
    const prevMonthStart = addDays(start, -prevDays);
    for (let i = 0; i < prevDays; i++) {
      days.push({ date: addDays(prevMonthStart, i), isOutside: true });
    }
  }

  while (current <= end) {
    days.push({ date: current, isOutside: false });
    current = addDays(current, 1);
  }

  const nextDays = (7 - (days.length % 7)) % 7;
  if (showOutsideDays) {
    for (let i = 1; i <= nextDays; i++) {
      days.push({ date: addDays(end, i), isOutside: true });
    }
  }

  return days;
};

export {
  addDays,
  addMinutes,
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  formatDate,
  formatTime,
  getDay,
  getMonthDays,
  getRangeDays,
  getWeekDays,
  isDateBetween,
  isDatesBetween,
  isSameDay,
  startOfMonth,
  startOfWeek,
  startOfYear
};
