/**
 * @jest-environment node
 */
// The power policy decides how hard the radios run. It is a pure function of
// four facts, which is the whole reason it lives in TypeScript rather than in
// the native module: the decision is testable here, and native keeps only the
// mechanism.
//
// Two properties matter more than any individual mapping:
//   * A pocketed phone never runs flat out. That is where the battery goes.
//   * The mode does not oscillate. Every change restarts the scanner, so a
//     policy that flaps costs more than it saves.

import {
  bandFor,
  modeFor,
  PowerPolicy,
  type PowerInputs,
} from "../power-policy";

const FOREGROUND: PowerInputs = {
  batteryPercent: 80,
  charging: false,
  appForeground: true,
};

describe("battery bands", () => {
  test("maps levels to bands at the bitchat thresholds", () => {
    expect(bandFor(100, null)).toBe("normal");
    expect(bandFor(21, null)).toBe("normal");
    expect(bandFor(20, null)).toBe("low");
    expect(bandFor(11, null)).toBe("low");
    expect(bandFor(10, null)).toBe("critical");
    expect(bandFor(1, null)).toBe("critical");
  });

  test("an unknown battery reads as healthy", () => {
    // Refusing to scan properly because we could not read a percentage would be
    // a worse failure than the one it avoids. iOS always lands here.
    expect(bandFor(null, null)).toBe("normal");
    expect(bandFor(null, "critical")).toBe("normal");
  });

  // Hysteresis: dropping in is immediate, climbing out needs headroom. This is
  // ours, not bitchat's - they re-resolve on every 1% step, which on a phone
  // hovering at a threshold means a scanner restart every few seconds.
  test("entering a lower band happens immediately", () => {
    expect(bandFor(20, "normal")).toBe("low");
    expect(bandFor(10, "low")).toBe("critical");
  });

  test("leaving a lower band needs headroom above the threshold", () => {
    // Still low at 21, 22, 23 once we are already low.
    expect(bandFor(21, "low")).toBe("low");
    expect(bandFor(23, "low")).toBe("low");
    expect(bandFor(24, "low")).toBe("normal");
    // Same going from critical.
    expect(bandFor(11, "critical")).toBe("critical");
    expect(bandFor(13, "critical")).toBe("critical");
    expect(bandFor(14, "critical")).toBe("low");
  });

  test("a phone wobbling on a threshold does not oscillate", () => {
    // Charging noise around 20% is the realistic case: a naive threshold would
    // flip band on every reading, and every flip restarts the scan.
    const policy = new PowerPolicy();
    policy.next({ ...FOREGROUND, batteryPercent: 25 });
    const first = policy.current;
    const changes: (string | null)[] = [];
    for (const pct of [20, 21, 20, 22, 21, 23, 20, 22]) {
      changes.push(policy.next({ ...FOREGROUND, batteryPercent: pct }));
    }
    // One transition into power-saver at 20, and nothing after it.
    expect(changes.filter((c) => c !== null)).toEqual(["power-saver"]);
    expect(first).toBe("balanced");
  });
});

describe("mode selection", () => {
  test("background never runs flat out, whatever the battery", () => {
    for (const batteryPercent of [100, 50, 21, 20, 11]) {
      expect(
        modeFor({ batteryPercent, charging: false, appForeground: false }).mode,
      ).toBe("power-saver");
    }
  });

  test("background on a critical battery drops further still", () => {
    expect(
      modeFor({ batteryPercent: 5, charging: false, appForeground: false })
        .mode,
    ).toBe("ultra-low-power");
  });

  test("background beats charging", () => {
    // Plugged in but pocketed: nobody is waiting on discovery, so there is
    // nothing to spend the power on.
    expect(
      modeFor({ batteryPercent: 90, charging: true, appForeground: false })
        .mode,
    ).toBe("power-saver");
  });

  test("charging in the foreground is the only route to performance", () => {
    expect(modeFor({ ...FOREGROUND, charging: true }).mode).toBe("performance");
    // On battery, even at 100%, foreground is balanced - fast enough for
    // someone watching the Mesh tab, without being the reason the phone dies.
    expect(modeFor({ ...FOREGROUND, batteryPercent: 100 }).mode).toBe(
      "balanced",
    );
  });

  test("foreground scales down as the battery falls", () => {
    expect(modeFor({ ...FOREGROUND, batteryPercent: 50 }).mode).toBe(
      "balanced",
    );
    expect(modeFor({ ...FOREGROUND, batteryPercent: 15 }).mode).toBe(
      "power-saver",
    );
    expect(modeFor({ ...FOREGROUND, batteryPercent: 5 }).mode).toBe(
      "ultra-low-power",
    );
  });

  test("an unknown battery stays balanced rather than assuming the worst", () => {
    expect(modeFor({ ...FOREGROUND, batteryPercent: null }).mode).toBe(
      "balanced",
    );
  });
});

describe("PowerPolicy", () => {
  test("reports a mode once and stays quiet until it changes", () => {
    const policy = new PowerPolicy();
    expect(policy.next(FOREGROUND)).toBe("balanced");
    // Same inputs, and a small battery move that crosses nothing.
    expect(policy.next(FOREGROUND)).toBeNull();
    expect(policy.next({ ...FOREGROUND, batteryPercent: 78 })).toBeNull();
  });

  test("backgrounding is a change worth applying", () => {
    const policy = new PowerPolicy();
    policy.next(FOREGROUND);
    expect(policy.next({ ...FOREGROUND, appForeground: false })).toBe(
      "power-saver",
    );
    expect(policy.next({ ...FOREGROUND, appForeground: true })).toBe(
      "balanced",
    );
  });

  test("reset makes the next call re-apply", () => {
    // The radios going down leaves native holding a mode we no longer track, so
    // a restart has to state one explicitly rather than assume agreement.
    const policy = new PowerPolicy();
    expect(policy.next(FOREGROUND)).toBe("balanced");
    expect(policy.next(FOREGROUND)).toBeNull();
    policy.reset();
    expect(policy.current).toBeNull();
    expect(policy.next(FOREGROUND)).toBe("balanced");
  });

  test("never oscillates across a long realistic discharge", () => {
    // A day in a pocket: 100% down to 2%, backgrounded, one reading per
    // percent. A correct policy changes mode exactly twice (into power-saver at
    // the start, then into ultra-low-power once critical) and never goes back
    // up, because the battery never does.
    const policy = new PowerPolicy();
    const applied: string[] = [];
    for (let pct = 100; pct >= 2; pct--) {
      const next = policy.next({
        batteryPercent: pct,
        charging: false,
        appForeground: false,
      });
      if (next !== null) applied.push(next);
    }
    expect(applied).toEqual(["power-saver", "ultra-low-power"]);
  });
});
