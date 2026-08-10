/**
 * @jest-environment node
 */
// A promise that never settles is the failure this exists for, and it is the
// one no amount of try/catch catches. These cases pin the three properties the
// launch path depends on: a healthy promise is untouched, a silent one yields
// the fallback, and a genuinely broken one still reports as broken.

import { settleOr, withTimeout } from "../with-timeout";

const never = new Promise<string>(() => {
  // Deliberately never settles: this is the shape of an orphaned native
  // promise, a Keystore that stalls, or a permission dialog whose Activity was
  // destroyed while it was up.
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("withTimeout", () => {
  test("passes a resolved value straight through", async () => {
    await expect(
      withTimeout(Promise.resolve("ok"), 100, "fallback"),
    ).resolves.toBe("ok");
  });

  test("yields the fallback when the promise never answers", async () => {
    const result = withTimeout(never, 1_000, "fallback");
    jest.advanceTimersByTime(1_000);
    await expect(result).resolves.toBe("fallback");
  });

  test("still rejects on a real failure", async () => {
    // Swallowing rejections here would hide the bugs that cause them. The
    // deadline covers silence, not errors.
    await expect(
      withTimeout(Promise.reject(new Error("boom")), 1_000, "fallback"),
    ).rejects.toThrow("boom");
  });

  test("ignores an answer that arrives after the deadline", async () => {
    let resolveLate: (v: string) => void = () => undefined;
    const late = new Promise<string>((r) => {
      resolveLate = r;
    });
    const result = withTimeout(late, 1_000, "fallback");
    jest.advanceTimersByTime(1_000);
    resolveLate("too late");
    // Whatever the fallback set in motion has already happened. Applying a
    // stale answer on top of it is how you end up with two identities.
    await expect(result).resolves.toBe("fallback");
  });
});

describe("settleOr", () => {
  test("treats a rejection and silence the same way", async () => {
    await expect(
      settleOr(Promise.reject(new Error("boom")), 1_000, "fallback"),
    ).resolves.toBe("fallback");

    const silent = settleOr(never, 1_000, "fallback");
    jest.advanceTimersByTime(1_000);
    await expect(silent).resolves.toBe("fallback");
  });
});
