// Release codenames.
//
// Each major version is an era named after a bird, chosen alphabetically:
// 1.x is an "A" bird, 2.x a "B", and so on. The name is revealed at the x.0.0
// launch and carried by every release in that major line, so the Version
// screen always shows the current era's bird.
//
// This is the app-side source of truth, read by the Version screen. The
// changelog tooling keeps a matching branch in cliff.toml; when you open a new
// era, add it in both places in the same change.

export const RELEASE_BIRDS: Record<string, string> = {
  "1": "Albatross",
};

// The codename for a version string like "1.0.0" or "1.4.2", resolved by its
// major number, or null if that major has no name yet.
export function birdForVersion(version: string): string | null {
  const major = version.split(".")[0];
  return RELEASE_BIRDS[major] ?? null;
}
