// Display formatters for timestamps and byte counts.
//
// Four byte-for-byte copies of `formatTime` lived in channel-list, dm-list,
// chat-search-results and notification-center, and two of `formatBytes`. They
// had already drifted in shape (two wrote the same branch as a ternary, two as
// an if) which is how they drift in behaviour next. One definition each, so
// every list row in the app agrees on what "yesterday" looks like.
//
// Everything here is locale-aware by way of `toLocale*String([])`: passing an
// empty locale list uses the device's own, so a 24-hour phone shows 24-hour
// times and a phone set to Japanese gets Japanese weekday names for free.

// Milliseconds in a day, for the calendar-distance arithmetic below.
const DAY_MS = 86_400_000;

/** Clock time only, e.g. "14:32". For a row already grouped under a date. */
export function formatClockTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Whole-day distance between two instants, ignoring the time of day, so
 * 23:59 and 00:01 the next morning are one day apart rather than two minutes.
 */
function calendarDaysAgo(then: Date, now: Date): number {
  const a = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

/**
 * The trailing timestamp on a conversation row.
 *
 * Follows the convention every mainstream messenger settled on, because it is
 * the one that answers "how stale is this?" in the fewest glyphs:
 *
 *   today          14:32       (the time is what you want)
 *   yesterday      Yesterday   (a date would make you do the subtraction)
 *   this week      Tue         (ditto)
 *   older          4 Mar
 *   another year   4 Mar 2025  (a bare "4 Mar" reads as this year)
 *
 * The old version jumped straight from a clock time to "4 Mar", so anything
 * that arrived yesterday looked exactly as old as something from last month.
 */
export function formatListTimestamp(ms: number): string {
  const then = new Date(ms);
  const now = new Date();
  const days = calendarDaysAgo(then, now);

  if (days <= 0) return formatClockTime(ms);
  if (days === 1) return "Yesterday";
  if (days < 7) return then.toLocaleDateString([], { weekday: "short" });
  if (then.getFullYear() === now.getFullYear()) {
    return then.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return then.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * A date separator inside a thread: "Today", "Yesterday", then the full date.
 * Same calendar-day rule as the row timestamps above, so a thread opened just
 * after midnight cannot label the message above it both "Today" and "Tue".
 */
export function formatDateSeparator(ms: number): string {
  const then = new Date(ms);
  const now = new Date();
  const days = calendarDaysAgo(then, now);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return then.toLocaleDateString([], { weekday: "long" });
  if (then.getFullYear() === now.getFullYear()) {
    return then.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  return then.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Byte count for a file row or a storage figure, e.g. "1.4 MB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${String(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Elapsed or remaining seconds as m:ss, for recordings and transfer ETAs. */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins)}:${secs.toString().padStart(2, "0")}`;
}
