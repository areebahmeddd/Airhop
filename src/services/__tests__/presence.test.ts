/**
 * @jest-environment node
 */
// Presence is the one setting that starts and stops radios, and it is reachable
// from three places: the Status picker, the Mesh banner's Resume button, and
// "Stop mesh" on the Android notification. What matters is that the mesh ends up
// in the state the label claims, by whatever route the user took to get there.
//
// The case that failed was a route nobody had walked: Invisible, then Away, then
// Online. Discoverability is intent the radio controller holds across a stop, on
// purpose - an outage must not make an Invisible user discoverable when the
// radio comes back - and Online only ever cleared it on the edge from Invisible.
// Coming back through Away skipped that edge, so the mesh restarted scanning and
// relaying but never advertising. Nobody could see the phone, the profile dot
// said Online, and no banner disagreed.

const mockStart = jest.fn<void, [string]>();
const mockStop = jest.fn<void, []>();
const mockSetDiscoverable = jest.fn<void, [boolean]>();

jest.mock("../mesh-service", () => ({
  __esModule: true,
  getMeshService: () => ({
    start: (nickname: string) => mockStart(nickname),
    stop: () => mockStop(),
    setDiscoverable: (on: boolean) => mockSetDiscoverable(on),
  }),
}));

import { useMeshStateStore } from "@store/mesh-state-store";
import { applyPresence } from "../presence";

beforeEach(() => {
  mockStart.mockReset();
  mockStop.mockReset();
  mockSetDiscoverable.mockReset();
  useMeshStateStore.getState().setPresenceStatus("online");
});

describe("presence transitions", () => {
  test("Invisible stops advertising without stopping the mesh", () => {
    applyPresence("invisible", "someone");
    expect(mockStop).not.toHaveBeenCalled();
    expect(mockSetDiscoverable).toHaveBeenCalledWith(false);
    expect(useMeshStateStore.getState().presenceStatus).toBe("invisible");
  });

  test("Away stops the whole mesh", () => {
    applyPresence("away", "someone");
    expect(mockStop).toHaveBeenCalled();
    expect(useMeshStateStore.getState().presenceStatus).toBe("away");
  });

  test("Online after Away restarts the mesh and is discoverable", () => {
    applyPresence("away", "someone");
    applyPresence("online", "someone");
    expect(mockStart).toHaveBeenCalledWith("someone");
    expect(mockSetDiscoverable).toHaveBeenLastCalledWith(true);
  });

  test("Invisible, then Away, then Online leaves the phone discoverable", () => {
    applyPresence("invisible", "someone");
    applyPresence("away", "someone");
    applyPresence("online", "someone");

    // The regression: the restart happened, so the mesh was scanning and
    // relaying, but discoverability was never re-stated and the controller was
    // still holding the Invisible choice. The phone advertised to nobody while
    // reporting itself Online.
    expect(mockStart).toHaveBeenCalledWith("someone");
    expect(mockSetDiscoverable).toHaveBeenLastCalledWith(true);
    expect(useMeshStateStore.getState().presenceStatus).toBe("online");
  });

  test("Invisible survives Away and back", () => {
    applyPresence("invisible", "someone");
    applyPresence("away", "someone");
    applyPresence("invisible", "someone");
    expect(mockSetDiscoverable).toHaveBeenLastCalledWith(false);
    expect(useMeshStateStore.getState().presenceStatus).toBe("invisible");
  });
});
