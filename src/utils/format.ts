// Display formatters for timestamps and byte counts.
//
// Four byte-for-byte copies of `formatTime` lived in channel-list, dm-list,
// chat-search-results and notification-center, and two of `formatBytes`. They
// had already drifted in shape (two wrote the same branch as a ternary, two as
// an if) which is how they drift in behaviour next. One definition each, so
// every list row in the app agrees on what "yesterday" looks like.
//
// Locale
// Everything here formats in the app's language, not the device's. Those are
// different once there is a language picker: a user reading Airhop in Spanish
// on an English phone should see "mar" beside a message, not "Tue". This is the
// whole reason `toLocale*String([])` is gone. The empty locale list meant "ask
// the OS", which is exactly the value that diverges.
//
// Reactivity: the language is read at call time from the i18n store. Every
// screen that renders a timestamp sits under App.tsx, which subscribes to that
// store for its own copy, so a language change re-renders the tree and these
// are re-run. No formatter needs to be a hook.
//
// Digits: month and weekday names come from Intl and are correct per locale for
// free. Numerals are pinned to Latin here on purpose. A byte count, a duration
// and a clock time are machine data, they sit in `FontFamily.mono` next to
// Latin units ("MB", "sats"), and a run of Arabic-Indic digits beside a Latin
// unit reads worse than either alone. Prose numbers, the ones inside a
// translated sentence, get no such override and follow the locale.

import { getLanguage, t } from "@i18n";

// Milliseconds in a day, for the calendar-distance arithmetic below.
const DAY_MS = 86_400_000;

// Clock time only, e.g. "14:32". For a row already grouped under a date.
// Latin digits are requested through the BCP-47 extension rather than the
// `numberingSystem` option. Both are standard, but an extension an engine does
// not implement is ignored during locale negotiation, whereas an option it does
// not implement can throw. Hermes ships a partial Intl, so the form that
// degrades quietly is the correct one here. Month and weekday names are words,
function latinLocale(): string {
  return `${getLanguage()}-u-nu-latn`;
}

// `Intl.DateTimeFormat` is expensive to construct and these run once per list
// row, so instances are cached per language and shape. `toLocaleDateString`
// built a fresh one on every call.
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function formatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const locale = latinLocale();
  const key = `${locale}|${JSON.stringify(options)}`;
  const cached = dateFormatters.get(key);
  if (cached !== undefined) return cached;
  const made = new Intl.DateTimeFormat(locale, options);
  dateFormatters.set(key, made);
  return made;
}

const numberFormatters = new Map<string, Intl.NumberFormat>();

function numberFormatter(options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const locale = latinLocale();
  const key = `${locale}|${JSON.stringify(options)}`;
  const cached = numberFormatters.get(key);
  if (cached !== undefined) return cached;
  const made = new Intl.NumberFormat(locale, options);
  numberFormatters.set(key, made);
  return made;
}

// Clock time only, e.g. "14:32". For a row already grouped under a date.
export function formatClockTime(ms: number): string {
  return formatter({
    hour: "2-digit",
    minute: "2-digit",
  }).format(ms);
}

// Whole-day distance between two instants, ignoring the time of day, so
// 23:59 and 00:01 the next morning are one day apart rather than two minutes.
function calendarDaysAgo(then: Date, now: Date): number {
  const a = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

// The trailing timestamp on a conversation row.
//
// Follows the convention every mainstream messenger settled on, because it is
// the one that answers "how stale is this?" in the fewest glyphs:
//
//   today          14:32       (the time is what you want)
//   yesterday      Yesterday   (a date would make you do the subtraction)
//   this week      Tue         (ditto)
//   older          4 Mar
//   another year   4 Mar 2025  (a bare "4 Mar" reads as this year)
//
// Without the middle steps, a clock time jumps straight to "4 Mar" and anything
// from yesterday looks exactly as old as something from last month.
export function formatListTimestamp(ms: number): string {
  const then = new Date(ms);
  const now = new Date();
  const days = calendarDaysAgo(then, now);

  if (days <= 0) return formatClockTime(ms);
  if (days === 1) return t("format.yesterday");
  if (days < 7) return formatter({ weekday: "short" }).format(then);
  if (then.getFullYear() === now.getFullYear()) return formatShortDate(ms);
  return formatter({
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(then);
}

// A date separator inside a thread: "Today", "Yesterday", then the full date.
// Same calendar-day rule as the row timestamps above, so a thread opened just
// after midnight cannot label the message above it both "Today" and "Tue".
export function formatDateSeparator(ms: number): string {
  const then = new Date(ms);
  const now = new Date();
  const days = calendarDaysAgo(then, now);

  if (days <= 0) return t("format.today");
  if (days === 1) return t("format.yesterday");
  if (days < 7) return formatter({ weekday: "long" }).format(then);
  if (then.getFullYear() === now.getFullYear()) {
    return formatter({
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(then);
  }
  return formatter({
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(then);
}

// Day and month with no year, e.g. "4 Mar". For a timestamp that sits beside a
// clock time, where the year is obvious or not worth the glyphs.
export function formatShortDate(ms: number): string {
  return formatter({
    month: "short",
    day: "numeric",
  }).format(ms);
}

// A full date for a record rather than a list row, e.g. "4 March 2026".
export function formatLongDate(ms: number): string {
  return formatter({
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(ms);
}

// A count inside a translated sentence, e.g. a wallet balance or a hop count.
//
// Grouped with the locale's own separator (1,000 / 1.000 / 1 000), because that
// is what makes a long number readable, but with Latin digits: these sit beside
// Latin units and in the monospace face, per the note at the top of this file.
export function formatNumber(value: number): string {
  return numberFormatter({}).format(value);
}

// Byte count for a file row or a storage figure, e.g. "1.4 MB".
export function formatBytes(bytes: number): string {
  // Grouping is off throughout: the largest value any branch can produce is
  // 1023 (bytes and kilobytes are promoted past that) and a grouped "1,023 B"
  // is noise. Latin digits and a locale decimal separator, so German reads
  // "1,4 MB" without the digits changing script.
  if (bytes < 1024) return `${formatFixed(bytes, 0)} B`;
  if (bytes < 1024 * 1024) return `${formatFixed(bytes / 1024, 0)} KB`;
  return `${formatFixed(bytes / (1024 * 1024), 1)} MB`;
}

function formatFixed(value: number, fractionDigits: number): string {
  return numberFormatter({
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping: false,
  }).format(value);
}

// Elapsed or remaining seconds as m:ss, for recordings and transfer ETAs.
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins)}:${secs.toString().padStart(2, "0")}`;
}
