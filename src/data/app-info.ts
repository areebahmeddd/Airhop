// App identity, and every URL that points back at the project.
//
// One place so the About and Version screens agree, and so neither hardcodes a
// version literal: the running version is read from app.json, which is the
// single source of truth for what this build actually is. Every GitHub link is
// derived from one repo slug for the same reason.

import appConfig from "../../app.json";

// This build's version, not the newest release on GitHub. The Version screen
// fetches that separately when the user asks it to check for updates.
export const APP_VERSION: string = appConfig.expo.version;

const GITHUB_REPO = "areebahmeddd/airhop";

export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

// GitHub redirects /releases/latest to the newest published release, so this
// opens the current release notes with no network round trip of its own.
export const LATEST_RELEASE_PAGE = `${GITHUB_URL}/releases/latest`;

// Returns the newest release as JSON (tag_name, html_url). Used only by the
// manual "Check for updates" action.
export const LATEST_RELEASE_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

export const NEW_ISSUE_URL = `${GITHUB_URL}/issues/new`;

export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;

// Identity, not copy: a license is named the same in every locale, so it sits
// here with AUTHOR_NAME rather than in the translation catalog.
export const LICENSE_NAME = "MIT License";

// One per platform, so a user can be pointed at the store they can review on.
export const APP_STORE_URL = "https://apps.apple.com/app/airhop/id000000000";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=org.onemindlabs.airhop";

export const AUTHOR_NAME = "Areeb Ahmed";
export const AUTHOR_URL = "https://areeb.dev";
