/**
 * @jest-environment node
 */
// Transfer-progress store.
//
// The store drives the progress card the user watches during a multi-minute
// Bluetooth transfer, so the properties that matter are: progress never
// exceeds 100%, a finished transfer reads as complete, and speed/ETA are sane.

import {
  transferEtaSec,
  transferSpeedBps,
  useTransferStore,
  type Transfer,
} from "../transfer-store";

beforeEach(() => {
  useTransferStore.getState().clearAll();
  jest.useRealTimers();
});

function state() {
  return useTransferStore.getState();
}

function begin(id: string, totalBytes: number, channel = "#test") {
  state().begin({
    id,
    direction: "send",
    channel,
    peerLabel: "alice",
    type: "image",
    name: "photo.jpg",
    totalBytes,
    startedAtMs: Date.now(),
  });
}

describe("begin / advance / finish", () => {
  it("registers an active transfer at 0 bytes", () => {
    begin("t1", 1000);
    const t = state().transfers["t1"];
    expect(t.status).toBe("active");
    expect(t.transferredBytes).toBe(0);
  });

  it("advances transferred bytes", () => {
    begin("t1", 1000);
    state().advance("t1", 400);
    expect(state().transfers["t1"].transferredBytes).toBe(400);
  });

  it("never lets progress exceed the total", () => {
    begin("t1", 1000);
    state().advance("t1", 5000);
    expect(state().transfers["t1"].transferredBytes).toBe(1000);
  });

  it("ignores advances on an unknown transfer", () => {
    state().advance("nope", 100);
    expect(state().transfers["nope"]).toBeUndefined();
  });

  it("marks a finished transfer complete at full bytes", () => {
    jest.useFakeTimers();
    begin("t1", 1000);
    state().advance("t1", 300);
    state().finish("t1");
    const t = state().transfers["t1"];
    expect(t.status).toBe("done");
    expect(t.transferredBytes).toBe(1000);
  });

  it("auto-dismisses a finished transfer after the settle delay", () => {
    jest.useFakeTimers();
    begin("t1", 1000);
    state().finish("t1");
    expect(state().transfers["t1"]).toBeDefined();
    jest.advanceTimersByTime(4000);
    expect(state().transfers["t1"]).toBeUndefined();
  });

  it("auto-dismisses a failed transfer too", () => {
    jest.useFakeTimers();
    begin("t1", 1000);
    state().fail("t1");
    expect(state().transfers["t1"].status).toBe("failed");
    jest.advanceTimersByTime(4000);
    expect(state().transfers["t1"]).toBeUndefined();
  });

  it("stops advancing once finished", () => {
    jest.useFakeTimers();
    begin("t1", 1000);
    state().finish("t1");
    state().advance("t1", 200);
    // finish pinned it at 1000; a late advance must not drag it back down.
    expect(state().transfers["t1"].transferredBytes).toBe(1000);
  });
});

describe("activeForChannel", () => {
  it("returns only this channel's transfers, oldest first", () => {
    state().begin({
      id: "a",
      direction: "send",
      channel: "#test",
      peerLabel: "",
      type: "image",
      name: "a",
      totalBytes: 10,
      startedAtMs: 100,
    });
    state().begin({
      id: "b",
      direction: "receive",
      channel: "dm:aa",
      peerLabel: "",
      type: "image",
      name: "b",
      totalBytes: 10,
      startedAtMs: 50,
    });
    expect(
      state()
        .activeForChannel("#test")
        .map((t) => t.id),
    ).toEqual(["a"]);
    expect(
      state()
        .activeForChannel("dm:aa")
        .map((t) => t.id),
    ).toEqual(["b"]);
  });
});

describe("speed and ETA", () => {
  function make(overrides: Partial<Transfer>): Transfer {
    return {
      id: "x",
      direction: "send",
      channel: "#test",
      peerLabel: "",
      type: "image",
      name: "x",
      totalBytes: 1000,
      transferredBytes: 0,
      startedAtMs: 0,
      updatedAtMs: 0,
      speedBps: 0,
      status: "active",
      ...overrides,
    };
  }

  it("reports the stored smoothed speed", () => {
    expect(transferSpeedBps(make({ speedBps: 250 }))).toBe(250);
  });

  it("estimates remaining time from the current speed", () => {
    // 250 B/s, 500 bytes left => 2 seconds.
    const t = make({ totalBytes: 1000, transferredBytes: 500, speedBps: 250 });
    expect(transferEtaSec(t)).toBe(2);
  });

  it("reports 0 ETA when the transfer is complete", () => {
    const t = make({ totalBytes: 1000, transferredBytes: 1000, speedBps: 250 });
    expect(transferEtaSec(t)).toBe(0);
  });

  it("returns null ETA when speed is not yet known", () => {
    expect(transferEtaSec(make({ speedBps: 0 }))).toBeNull();
  });

  it("derives a real rate from timed advances", () => {
    // First advance seeds the EMA at the instantaneous rate: 500 B over 2 s.
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    state().begin({
      id: "s",
      direction: "send",
      channel: "#test",
      peerLabel: "",
      type: "document",
      name: "f",
      totalBytes: 4000,
      startedAtMs: Date.now(),
    });
    jest.setSystemTime(new Date("2026-01-01T00:00:02Z"));
    state().advance("s", 500);
    expect(state().transfers["s"].speedBps).toBe(250);
  });
});

describe("cancel", () => {
  it("marks a transfer cancelled then auto-dismisses it", () => {
    jest.useFakeTimers();
    begin("t1", 1000);
    state().cancel("t1");
    expect(state().transfers["t1"].status).toBe("cancelled");
    jest.advanceTimersByTime(1500);
    expect(state().transfers["t1"]).toBeUndefined();
  });

  it("stops progress once cancelled", () => {
    jest.useFakeTimers();
    begin("t1", 1000);
    state().cancel("t1");
    state().advance("t1", 500);
    // A cancelled transfer must not keep advancing.
    expect(state().transfers["t1"].transferredBytes).toBe(0);
  });
});

describe("activeCount", () => {
  it("counts active and stalled transfers, not finished ones", () => {
    jest.useFakeTimers();
    begin("a", 100);
    begin("b", 100);
    state().finish("b");
    expect(state().activeCount()).toBe(1);
  });
});

describe("reconcile (stall watchdog)", () => {
  it("flips a quiet transfer to stalled, then failed", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    begin("t1", 1000);
    state().advance("t1", 400);

    // Still fresh: nothing changes.
    jest.setSystemTime(new Date("2026-01-01T00:00:05Z"));
    state().reconcile();
    expect(state().transfers["t1"].status).toBe("active");

    // Quiet past the stall threshold: stalled, and the speed is zeroed.
    jest.setSystemTime(new Date("2026-01-01T00:00:20Z"));
    state().reconcile();
    expect(state().transfers["t1"].status).toBe("stalled");
    expect(state().transfers["t1"].speedBps).toBe(0);
    // Progress is preserved, not reset or jumped to 100%.
    expect(state().transfers["t1"].transferredBytes).toBe(400);

    // Quiet past the fail threshold: failed, then auto-dismissed.
    jest.setSystemTime(new Date("2026-01-01T00:01:00Z"));
    state().reconcile();
    expect(state().transfers["t1"].status).toBe("failed");
    jest.advanceTimersByTime(4000);
    expect(state().transfers["t1"]).toBeUndefined();
  });

  it("recovers a stalled transfer when progress resumes", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    begin("t1", 1000);
    state().advance("t1", 400);

    jest.setSystemTime(new Date("2026-01-01T00:00:20Z"));
    state().reconcile();
    expect(state().transfers["t1"].status).toBe("stalled");

    // The peer came back: a byte arriving flips it live again.
    state().advance("t1", 500);
    expect(state().transfers["t1"].status).toBe("active");
    expect(state().transfers["t1"].transferredBytes).toBe(500);
  });

  it("leaves finished, failed and cancelled transfers alone", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    begin("done", 100);
    begin("cancelled", 100);
    state().finish("done");
    state().cancel("cancelled");

    jest.setSystemTime(new Date("2026-01-01T00:02:00Z"));
    state().reconcile();
    // finish/cancel already scheduled their own dismissals; reconcile must not
    // resurrect or re-status them.
    expect(state().transfers["done"]?.status ?? "gone").not.toBe("stalled");
    expect(state().transfers["cancelled"]?.status ?? "gone").not.toBe(
      "stalled",
    );
  });
});
