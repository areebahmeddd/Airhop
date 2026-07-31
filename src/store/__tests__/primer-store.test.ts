/**
 * @jest-environment node
 */
// The primer sits directly in front of BLE startup: startMeshWithPermissions
// awaits it before requesting anything. That makes "never hangs" the property
// that actually matters here - a promise left unresolved would hold the radios
// down for the whole session, which is a worse bug than the confusing
// permission prompt the primer exists to prevent.

import {
  acknowledgePermissionPrimer,
  showPermissionPrimer,
  usePrimerStore,
} from "../primer-store";

describe("permission primer", () => {
  beforeEach(() => {
    usePrimerStore.setState({ visible: false });
    // Drain any resolver a previous test left behind.
    acknowledgePermissionPrimer();
  });

  test("shows the sheet and resolves once acknowledged", async () => {
    const waited = showPermissionPrimer();
    expect(usePrimerStore.getState().visible).toBe(true);

    acknowledgePermissionPrimer();
    await expect(waited).resolves.toBeUndefined();
    expect(usePrimerStore.getState().visible).toBe(false);
  });

  test("acknowledging is idempotent", () => {
    void showPermissionPrimer();
    acknowledgePermissionPrimer();
    // A second call (backdrop tap landing after the button, say) must not throw
    // or re-open anything.
    expect(() => acknowledgePermissionPrimer()).not.toThrow();
    expect(usePrimerStore.getState().visible).toBe(false);
  });

  test("a second request while one is open resolves rather than queueing", async () => {
    const first = showPermissionPrimer();
    // Two startup paths racing (a remount mid-onboarding) must not leave the
    // second one waiting on a gesture that will only ever resolve the first.
    await expect(showPermissionPrimer()).resolves.toBeUndefined();
    acknowledgePermissionPrimer();
    await expect(first).resolves.toBeUndefined();
  });

  test("acknowledging with nothing pending is a no-op", () => {
    expect(() => acknowledgePermissionPrimer()).not.toThrow();
    expect(usePrimerStore.getState().visible).toBe(false);
  });
});
