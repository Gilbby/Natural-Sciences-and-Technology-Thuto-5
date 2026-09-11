/**
 * Date helpers for the calendar home screen. Weeks start on Monday (SA school
 * convention). Everything works in local time — the child's own day is the unit.
 */

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const WEEKDAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function addDays(date: Date, days: number): Date {
  const copy = startOfDay(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

/** `YYYY-MM-DD` in local time — the key used for storage and lookups. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

/** Whole days between two dates, ignoring clock time and DST wobble. */
export function daysBetween(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.round(ms / 86_400_000);
}

/** 0 = Monday … 6 = Sunday. */
export function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function startOfWeek(date: Date): Date {
  return addDays(date, -mondayIndex(date));
}

/**
 * The month laid out as rows of seven. Cells outside the month are `null` so
 * the grid never shows a day that belongs somewhere else.
 */
export function monthMatrix(year: number, month: number): Array<Array<Date | null>> {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lead = mondayIndex(first);

  const cells: Array<Date | null> = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: Array<Array<Date | null>> = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/** "Monday, 10 August" — spoken aloud, so no abbreviations. */
export function spokenDate(date: Date): string {
  return `${WEEKDAY_NAMES[mondayIndex(date)]}, ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}
