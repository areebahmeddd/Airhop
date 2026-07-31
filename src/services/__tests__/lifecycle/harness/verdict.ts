// A scenario records what it observed, then asserts once at the end.
//
// A bare expect() fails on the first mismatch and throws the rest of the
// picture away, which for a lifecycle bug is exactly the wrong trade: the
// interesting question is never "which assertion failed" but "what was the
// sequence that got us there". Collecting every check and printing it against
// the trace turns a red test into a readable account of the device's session.

import type { DeviceOS } from "./os";

interface Check {
  label: string;
  pass: boolean;
  detail?: string;
}

export class Verdict {
  private readonly checks: Check[] = [];

  constructor(
    readonly id: string,
    readonly title: string,
    private readonly os: DeviceOS,
  ) {}

  // `pass` is what SHOULD be true of a correct app. A false here is a defect in
  // Airhop, not in the scenario.
  check(label: string, pass: boolean, detail?: string): void {
    this.checks.push({ label, pass, detail });
    this.os.log("verdict", pass ? "PASS" : "FAIL", label);
  }

  get failed(): Check[] {
    return this.checks.filter((c) => !c.pass);
  }

  report(): string {
    const lines: string[] = [];
    lines.push("");
    lines.push(`━━━ ${this.id}: ${this.title} ━━━`);
    lines.push("");
    lines.push("TIMELINE");
    lines.push(this.os.formatTrace());
    lines.push("");
    lines.push("CHECKS");
    for (const c of this.checks) {
      lines.push(
        `  ${c.pass ? "PASS" : "FAIL"}  ${c.label}${c.detail !== undefined ? `\n         ${c.detail}` : ""}`,
      );
    }
    if (this.os.crashed !== null) {
      lines.push("");
      lines.push(`PROCESS DIED: ${this.os.crashed}`);
    }
    lines.push("");
    return lines.join("\n");
  }

  // Throw with the full account if anything a correct app would satisfy did not.
  assert(): void {
    if (this.failed.length === 0) return;
    throw new Error(this.report());
  }
}
