// App identity and the handful of URLs that point back at the project. Kept
// in one place so the About and Version screens agree on the version string
// and the GitHub location, and so neither hardcodes a version literal: the
// running version is read from app.json, the single source of truth for what
// this build actually is.

import appConfig from "../../app.json";

// The version this build is running. Not the latest release on GitHub, which
// the Version screen fetches separately to check for updates.
export const APP_VERSION: string = appConfig.expo.version;

const GITHUB_REPO = "areebahmeddd/Airhop";

export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

// The project's MIT license text on GitHub, same target as the landing footer.
export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;

// GitHub redirects /releases/latest to the newest published release, so this
// opens the current release notes without a network round trip of our own.
export const LATEST_RELEASE_PAGE = `${GITHUB_URL}/releases/latest`;

// Returns the newest release as JSON (tag_name, html_url). Used only by the
// manual "Check for updates" action.
export const LATEST_RELEASE_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

export const AUTHOR_NAME = "Areeb Ahmed";
export const AUTHOR_URL = "https://areeb.dev";
