const REPO = "https://github.com/areebahmeddd/airhop";

export const SITE_URL = "https://airhop.1mindlabs.org";

export const REPO_URL = REPO;

export const SPONSOR_URL = "https://github.com/sponsors/areebahmeddd";

export const SOCIAL_LINKS = {
  x: "https://x.com/areebahmeddd",
  linkedin: "https://linkedin.com/in/areebahmeddd",
  instagram: "https://instagram.com/areebahmeddd",
} as const;

export const STORE_LINKS = {
  appStore: "https://apps.apple.com/app/airhop/id000000000",
  testFlight: "https://testflight.apple.com/join/airhop",
  playStore: "https://play.google.com/store/apps/details?id=org.onemindlabs.airhop",
  fDroid: "https://f-droid.org/en/packages/org.onemindlabs.airhop",
} as const;

export const REPO_LINKS = {
  license: `${REPO}/blob/main/LICENSE`,
  contributing: `${REPO}/blob/main/CONTRIBUTING.md`,
  securityReview: `${REPO}/blob/main/.github/agents/security-review.md`,
  messageRouter: `${REPO}/blob/main/src/core/router/message-router.ts`,
  architectureDoc: `${REPO}/blob/main/docs/spec/ARCHITECTURE.md`,
  protocolsDoc: `${REPO}/blob/main/docs/spec/PROTOCOLS.md`,
  glossaryDoc: `${REPO}/blob/main/docs/dev/GLOSSARY.md`,
  progressDoc: `${REPO}/blob/main/docs/dev/PROGRESS.md`,
  roadmapDoc: `${REPO}/blob/main/docs/design/ROADMAP.md`,
  visionDoc: `${REPO}/blob/main/docs/design/VISION.md`,
  issues: `${REPO}/issues`,
  discussions: `${REPO}/discussions`,
  releases: `${REPO}/releases/latest`,
  apk: `${REPO}/releases/latest/download/airhop.apk`,
  pressAssets: `${REPO}/tree/main/press/out`,
  releasesApi: "https://api.github.com/repos/areebahmeddd/airhop/releases/latest",
} as const;
