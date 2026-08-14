// A scenario: a world, some phones, a story, and a verdict.
//
// The reporting style is inherited from the lifecycle harness and is worth
// keeping: collect every check, then print the whole account against the
// timeline. For a multi-device failure the interesting question is never "which
// assertion failed" - it is "what was the sequence across five phones that got
// us there", and a bare expect() throws that away on the first mismatch.
//
// Every scenario also prints its seed. A red soak run is only useful if it can
// be re-run identically, and this is where that promise is kept.

import type { SimDevice } from "./device";
import type { Finding } from "./invariants";
import { World } from "./world";

interface Check {
  label: string;
  pass: boolean;
  detail?: string;
}

export interface ScenarioOptions {
  id: string;
  title: string;
  seed?: number;
}

export class Scenario {
  readonly world: World;
  readonly id: string;
  readonly title: string;
  private readonly checks: Check[] = [];
  private readonly devices: SimDevice[] = [];
  private readonly timersAtStart: number;

  constructor(opts: ScenarioOptions) {
    this.id = opts.id;
    this.title = opts.title;
    this.world = new World({ seed: opts.seed ?? 1, name: opts.id });
    this.timersAtStart = jest.getTimerCount();
  }

  track(...devices: SimDevice[]): void {
    this.devices.push(...devices);
  }

  get tracked(): SimDevice[] {
    return this.devices;
  }

  // `pass` is what SHOULD be true of a correct app. A false here is a defect in
  // Airhop, not in the scenario.
  check(label: string, pass: boolean, detail?: string): void {
    this.checks.push({ label, pass, detail });
    this.world.say(pass ? "PASS" : "FAIL", label);
  }

  // Fold invariant findings in. An empty list is a pass under that name, which
  // keeps a clean run's report readable rather than silent.
  expectNone(label: string, findings: Finding[]): void {
    if (findings.length === 0) {
      this.check(label, true);
      return;
    }
    for (const f of findings) {
      this.checks.push({
        label: `${label}: ${f.invariant}`,
        pass: false,
        detail: f.detail,
      });
      this.world.say("FAIL", `${f.invariant}, ${f.detail}`);
    }
  }

  get failures(): Check[] {
    return this.checks.filter((c) => !c.pass);
  }

  report(tailOnly = false): string {
    const lines: string[] = [];
    lines.push("");
    lines.push(`━━━ ${this.id}: ${this.title} ━━━`);
    lines.push(
      `seed ${this.world.seed}  ·  ${this.devices.length} device(s)  ·  ${this.world.now}ms simulated`,
    );
    lines.push("");
    if (this.devices.length > 0) {
      lines.push("DEVICES");
      for (const d of this.devices) {
        lines.push(
          `  ${d.id.padEnd(10)} ${d.platform.padEnd(8)} peer=${d.peerID.slice(0, 8)} ` +
            `peers=${d.peerCount()} ${d.os.crashed !== null ? `DEAD(${d.os.crashed})` : ""}`,
        );
      }
      lines.push("");
    }
    lines.push("TIMELINE");
    lines.push(
      tailOnly ? this.world.formatTail(150) : this.world.formatTimeline(),
    );
    lines.push("");
    lines.push("CHECKS");
    for (const c of this.checks) {
      lines.push(
        `  ${c.pass ? "PASS" : "FAIL"}  ${c.label}` +
          (c.detail !== undefined ? `\n         ${c.detail}` : ""),
      );
    }
    lines.push("");
    return lines.join("\n");
  }

  // Throw with the full account if anything a correct app would satisfy did not.
  assert(tailOnly = false): void {
    if (this.failures.length === 0) return;
    throw new Error(this.report(tailOnly));
  }

  // Tear the world down, then check nothing was left running. Called from an
  // afterEach so it runs even when the scenario already failed.
  close(): { leakedTimers: number } {
    this.world.close();
    const leaked = Math.max(0, jest.getTimerCount() - this.timersAtStart);
    return { leakedTimers: leaked };
  }
}

// Wait for a condition, advancing the world in slices, and give up after a
// budget. Returns whether it came true, so a scenario can report "never
// happened" rather than hanging or silently continuing.
export async function waitFor(
  world: World,
  predicate: () => boolean,
  budgetMs = 15_000,
  sliceMs = 50,
  stepMs = 5,
): Promise<boolean> {
  let spent = 0;
  if (predicate()) return true;
  while (spent < budgetMs) {
    await world.advance(sliceMs, stepMs);
    spent += sliceMs;
    if (predicate()) return true;
  }
  return false;
}

// Let the world run for a while with nothing to wait for, which is how a
// scenario says "and then some time passed". Written out as `waitFor(world, ()
// => false, ms)` it reads as a mistake, since waiting for `false` looks like a
// bug rather than a deliberate sleep.
export async function advanceFor(world: World, ms: number): Promise<void> {
  await waitFor(world, () => false, ms);
}

// Same, but for a crowded world where the fine-grained step is the bottleneck
// rather than the thing being measured.
export async function waitForCoarse(
  world: World,
  predicate: () => boolean,
  budgetMs = 30_000,
): Promise<boolean> {
  return waitFor(world, predicate, budgetMs, 100, 25);
}

// Every device in the list can see every other one on the mesh.
export function allSeeEachOther(devices: SimDevice[]): boolean {
  return devices.every((d) =>
    devices.every((o) => o.id === d.id || d.peers().includes(o.peerID)),
  );
}
