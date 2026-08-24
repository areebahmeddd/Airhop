/** @jest-environment node */

import type { TokenInfo } from "@core/payments/cashu";
import {
  formatAmount,
  formatBytes,
  formatClockTime,
  formatDateSeparator,
  formatDuration,
  formatListTimestamp,
  formatNumber,
  formatTokenSummary,
} from "../format";

// A fixed "now" so the calendar-distance branches are deterministic. Midday on
// purpose: a boundary hour would hide the very bug this module exists to avoid,
// where elapsed-milliseconds arithmetic calls 23:50 and 00:10 the same day.
const NOW = new Date(2026, 6, 30, 12, 0, 0);

function daysBefore(days: number, hour = 12): Date {
  return new Date(2026, 6, 30 - days, hour, 0, 0);
}

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(NOW);
});

afterEach(() => {
  jest.useRealTimers();
});

describe("formatListTimestamp", () => {
  it("shows a clock time for today", () => {
    // Locale-dependent separator and 12/24h, so assert the shape not the string.
    expect(formatListTimestamp(daysBefore(0, 9).getTime())).toMatch(/\d/);
    expect(formatListTimestamp(daysBefore(0, 9).getTime())).toBe(
      formatClockTime(daysBefore(0, 9).getTime()),
    );
  });

  it("names yesterday rather than dating it", () => {
    expect(formatListTimestamp(daysBefore(1).getTime())).toBe("Yesterday");
  });

  it("counts calendar days, not elapsed time", () => {
    // 23:50 last night is twenty minutes ago but belongs to yesterday. This is
    // the case a `delta < 86400000` check gets wrong.
    jest.setSystemTime(new Date(2026, 6, 30, 0, 10, 0));
    expect(
      formatListTimestamp(new Date(2026, 6, 29, 23, 50, 0).getTime()),
    ).toBe("Yesterday");
  });

  it("uses a weekday inside the last week", () => {
    const label = formatListTimestamp(daysBefore(3).getTime());
    expect(label).not.toBe("Yesterday");
    // A short weekday name, never a number.
    expect(label).not.toMatch(/\d/);
  });

  it("drops the year for an older date in the same year", () => {
    expect(formatListTimestamp(daysBefore(60).getTime())).not.toContain("2026");
  });

  it("keeps the year once it is a different one", () => {
    expect(formatListTimestamp(new Date(2025, 2, 4, 12).getTime())).toContain(
      "2025",
    );
  });
});

describe("formatDateSeparator", () => {
  it("labels today and yesterday in words", () => {
    expect(formatDateSeparator(daysBefore(0).getTime())).toBe("Today");
    expect(formatDateSeparator(daysBefore(1).getTime())).toBe("Yesterday");
  });

  it("agrees with formatListTimestamp on which day it is", () => {
    // Both read the same calendar rule, so a thread opened just after midnight
    // can never label a message "Today" in one place and a weekday in the other.
    jest.setSystemTime(new Date(2026, 6, 30, 0, 5, 0));
    const lastNight = new Date(2026, 6, 29, 23, 59, 0).getTime();
    expect(formatDateSeparator(lastNight)).toBe("Yesterday");
    expect(formatListTimestamp(lastNight)).toBe("Yesterday");
  });
});

describe("formatBytes", () => {
  it("scales through the units", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2 KiB");
    expect(formatBytes(1_500_000)).toBe("1.4 MiB");
  });

  it("switches unit exactly at the boundary", () => {
    expect(formatBytes(1023)).toBe("1023 B");
    expect(formatBytes(1024)).toBe("1 KiB");
    expect(formatBytes(1024 * 1024 - 1)).toContain("KiB");
    expect(formatBytes(1024 * 1024)).toBe("1.0 MiB");
  });
});

describe("formatDuration", () => {
  it("pads the seconds", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(9)).toBe("0:09");
    expect(formatDuration(75)).toBe("1:15");
    expect(formatDuration(600)).toBe("10:00");
  });

  it("never renders a negative or fractional time", () => {
    // A transfer ETA can go momentarily negative as the last fragment lands.
    expect(formatDuration(-4)).toBe("0:00");
    expect(formatDuration(30.6)).toBe("0:31");
  });
});

// ---- Money ----
//
// These moved here from core/payments/cashu.ts, which cannot hold a formatter:
// it is the protocol layer and imports no display code, so it had no way to ask
// what language the app is in and was calling a bare `toLocaleString()`, which
// asks the device instead.

describe("formatAmount", () => {
  it("renders sats as a grouped integer in the app's language", () => {
    // Grouped through formatNumber, so the separator follows the app's language
    // rather than the phone's, and the digits stay Latin beside a Latin unit.
    expect(formatAmount(21_500, "sat", "sat")).toEqual({
      value: formatNumber(21_500),
      label: "sat",
    });
    expect(formatAmount(21_500, "sat", "sat").value).toBe("21,500");
  });

  it("renders sats as bitcoin when asked", () => {
    expect(formatAmount(21_500, "sat", "btc")).toEqual({
      value: "0.000215",
      label: "BTC",
    });
  });

  it("leaves a mint's own currency alone", () => {
    // A mint issuing usd is already quoting a currency. Reformatting it as
    // bitcoin would invent an exchange rate nobody supplied.
    expect(formatAmount(500, "usd", "btc")).toEqual({
      value: formatNumber(500),
      label: "usd",
    });
  });

  it("shows an empty wallet as 0, not 0.00000000", () => {
    expect(formatAmount(0, "sat", "btc").value).toBe("0");
  });
});

describe("formatTokenSummary", () => {
  // Only the three fields the summary reads. Decoding a real token is
  // decodeToken's test, not this one.
  const info = (amount: number, unit: string, memo?: string): TokenInfo =>
    ({ amount, unit, memo }) as TokenInfo;

  it("renders amount and unit, with the memo when present", () => {
    expect(formatTokenSummary(info(64, "sat"))).toBe("64 sat");
    expect(formatTokenSummary(info(64, "sat", "beer"))).toBe("64 sat - beer");
  });

  it("groups a large amount", () => {
    expect(formatTokenSummary(info(21_500, "sat"))).toBe("21,500 sat");
  });
});
