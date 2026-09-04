const GITHUB_OWNER = "areebahmeddd";

const GITHUB_REPO = `${GITHUB_OWNER}/airhop`;

const REPO = `https://github.com/${GITHUB_REPO}`;

export const SITE_URL = "https://airhop.1mindlabs.org";

export const REPO_URL = REPO;

export const SPONSOR_URL = `https://github.com/sponsors/${GITHUB_OWNER}`;

export const AUTHOR_NAME = "Areeb Ahmed";

export const AUTHOR_URL = "https://areeb.dev";

export const SOCIAL_LINKS = {
  x: "https://x.com/areebahmeddd",
  instagram: "https://instagram.com/areebahmeddd",
  linkedin: "https://linkedin.com/in/areebahmeddd",
} as const;

export const STORE_LINKS = {
  appStore: "https://apps.apple.com/app/airhop/id000000000",
  testFlight: "https://testflight.apple.com/join/airhop",
  playStore: "https://play.google.com/store/apps/details?id=org.onemindlabs.airhop",
  zapstore: "https://zapstore.dev/apps/org.onemindlabs.airhop",
} as const;

export const REPO_LINKS = {
  license: `${REPO}/blob/main/LICENSE`,
  contributing: `${REPO}/blob/main/CONTRIBUTING.md`,
  securityReview: `${REPO}/blob/main/.github/agents/security-review.md`,
  architectureDoc: `${REPO}/blob/main/docs/spec/ARCHITECTURE.md`,
  protocolsDoc: `${REPO}/blob/main/docs/spec/PROTOCOLS.md`,
  glossaryDoc: `${REPO}/blob/main/docs/dev/GLOSSARY.md`,
  progressDoc: `${REPO}/blob/main/docs/dev/PROGRESS.md`,
  roadmapDoc: `${REPO}/blob/main/docs/design/ROADMAP.md`,
  visionDoc: `${REPO}/blob/main/docs/design/VISION.md`,
  messageRouter: `${REPO}/blob/main/src/core/router/message-router.ts`,
  issues: `${REPO}/issues`,
  discussions: `${REPO}/discussions`,
  releases: `${REPO}/releases/latest`,
  releasesApi: `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
  apk: `${REPO}/releases/latest/download/airhop.apk`,
  pressAssets: `${REPO}/tree/main/press/out`,
} as const;
