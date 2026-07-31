// How hard the radios should work, given what the device can afford.
//
// Airhop scans and advertises at the most aggressive settings the platform
// offers - LOW_LATENCY both ways, TX_POWER_HIGH - and did so identically whether
// the app was on screen or pocketed, and whether the phone was at 100% or 4%.
// Continuous LOW_LATENCY scanning is roughly an order of magnitude more
// expensive than LOW_POWER, and for an app whose whole purpose is running in a
// pocket all day it is the single largest battery cost there is.
//
// The bands and the mode table follow bitchat-android's PowerProfileResolver
// (mesh/PowerManager.kt) deliberately: it is the reference implementation for
// this protocol, its thresholds are field-tested, and inventing different
// numbers would be guessing. Two things are ours:
//
//   * Hysteresis. bitchat re-resolves on every ACTION_BATTERY_CHANGED, which
//     fires on every 1% step. A phone sitting at 20% while discharging, or
//     wobbling either side of it while charging, would flip modes repeatedly -
//     and every flip restarts the scanner, which costs more than it saves.
//   * The policy lives in TypeScript rather than in the native module, because
//     the radios are already owned by one reconciler (radio-controller.ts) and
//     "how hard" belongs next to "whether at all". It also makes the decision a
//     pure function, so it is tested here rather than on a device.
//
// Native keeps only the mechanism: it observes the battery, reports it, and
// applies whichever mode it is told. No policy on that side.

export type PowerMode =
  "performance" | "balanced" | "power-saver" | "ultra-low-power";

// Matches bitchat AppConstants.Power.
const CRITICAL_BATTERY_PERCENT = 10;
const LOW_BATTERY_PERCENT = 20;

// How far back above a threshold the battery must climb before we leave the
// lower band. Only applies upward: dropping INTO a lower band is immediate,
// because running too hard on a nearly flat phone is the failure that matters.
const HYSTERESIS_PERCENT = 3;

export type BatteryBand = "normal" | "low" | "critical";

export interface PowerInputs {
  // 0-100, or null when the platform has not reported yet. Null is treated as a
  // healthy battery: refusing to scan properly because we could not read a
  // percentage would be a worse failure than the one it avoids.
  batteryPercent: number | null;
  charging: boolean;
  appForeground: boolean;
}

// Which band a level falls in, given the band we are already in.
//
// `previous` is what makes this sticky. Crossing down happens at the threshold;
// crossing back up needs the threshold plus HYSTERESIS_PERCENT.
export function bandFor(
  batteryPercent: number | null,
  previous: BatteryBand | null,
): BatteryBand {
  if (batteryPercent === null) return "normal";

  const criticalCeiling =
    previous === "critical"
      ? CRITICAL_BATTERY_PERCENT + HYSTERESIS_PERCENT
      : CRITICAL_BATTERY_PERCENT;
  if (batteryPercent <= criticalCeiling) return "critical";

  const lowCeiling =
    previous === "low" || previous === "critical"
      ? LOW_BATTERY_PERCENT + HYSTERESIS_PERCENT
      : LOW_BATTERY_PERCENT;
  if (batteryPercent <= lowCeiling) return "low";

  return "normal";
}

// The mode to run in. Mirrors bitchat's resolver, in the same order, because the
// ordering IS the policy:
//
//   * Background dominates everything. Off screen, nobody is waiting on
//     discovery latency, so there is no reason to pay for it - and this is where
//     a phone spends almost all of its day.
//   * Charging beats battery level. Plugged in, the cost is somebody else's.
//   * Otherwise the battery band decides.
//
// Foreground on battery is BALANCED rather than PERFORMANCE on purpose: a
// balanced scan still discovers peers in seconds, which is fast enough for
// somebody watching the Mesh tab, and reserving the most expensive setting for
// "plugged in" is what keeps the app from being the reason a phone dies.
export function modeFor(
  inputs: PowerInputs,
  previousBand: BatteryBand | null = null,
): { mode: PowerMode; band: BatteryBand } {
  const band = bandFor(inputs.batteryPercent, previousBand);

  if (!inputs.appForeground) {
    return {
      mode: band === "critical" ? "ultra-low-power" : "power-saver",
      band,
    };
  }
  if (inputs.charging) return { mode: "performance", band };
  if (band === "critical") return { mode: "ultra-low-power", band };
  if (band === "low") return { mode: "power-saver", band };
  return { mode: "balanced", band };
}

// Remembers the band across calls so the hysteresis above has something to be
// sticky against. Owned by RadioController; separate from it only so the policy
// can be exercised without a radio.
export class PowerPolicy {
  private band: BatteryBand | null = null;
  private mode: PowerMode | null = null;

  // The mode to apply now, or null when nothing has changed since last time.
  // Returning null rather than the unchanged mode is what keeps a battery
  // report that crosses nothing from restarting the scanner.
  next(inputs: PowerInputs): PowerMode | null {
    const resolved = modeFor(inputs, this.band);
    this.band = resolved.band;
    if (resolved.mode === this.mode) return null;
    this.mode = resolved.mode;
    return resolved.mode;
  }

  get current(): PowerMode | null {
    return this.mode;
  }

  // Forget everything. Used when the radios go down, so the next start applies
  // its mode rather than assuming the one native had before.
  reset(): void {
    this.band = null;
    this.mode = null;
  }
}
