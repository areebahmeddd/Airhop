// App identity and the handful of URLs that point back at the project. Kept
// in one place so the About and Version screens agree on the version string
// and the GitHub location, and so neither hardcodes a version literal: the
// running version is read from app.json, the single source of truth for what
// this build actually is.

import appConfig from "../../app.json";

// The version this build is running. Not the latest release on GitHub, which
// the Version screen fetches separately to check for updates.
export const APP_VERSION: string = appConfig.expo.version;

const GITHUB_REPO = "areebahmeddd/airhop";

export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

// The project's MIT license text on GitHub, same target as the landing footer.
export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;

// GitHub redirects /releases/latest to the newest published release, so this
// opens the current release notes without a network round trip of our own.
export const LATEST_RELEASE_PAGE = `${GITHUB_URL}/releases/latest`;

// New-issue form. The Help screen hardcoded this with a differently-cased slug;
// deriving it keeps every GitHub link pointed at one repo.
export const NEW_ISSUE_URL = `${GITHUB_URL}/issues/new`;

// Returns the newest release as JSON (tag_name, html_url). Used only by the
// manual "Check for updates" action.
export const LATEST_RELEASE_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

// The two store listings, same targets as the landing page. Used to point a
// user at the store they can actually review on, one per platform.
export const APP_STORE_URL = "https://apps.apple.com/app/airhop/id000000000";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=org.onemindlabs.airhop";

export const AUTHOR_NAME = "Areeb Ahmed";
export const AUTHOR_URL = "https://areeb.dev";
