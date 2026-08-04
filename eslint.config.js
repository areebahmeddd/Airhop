const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const globals = require("globals");

module.exports = defineConfig([
  ...expoConfig,
  {
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // eslint-config-expo's bundled eslint-plugin-import loads `typescript`
      // as a resolver instead of eslint-import-resolver-typescript, crashing
      // on Linux. @typescript-eslint covers these checks more accurately.
      "import/namespace": "off",
      "import/no-unresolved": "off",
      "import/no-duplicates": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      // BOM is harmless on Windows and handled by editors/git.
      "unicode-bom": "off",
    },
  },
  {
    files: [
      "src/**/__tests__/**/*.{ts,js}",
      "src/**/*.test.{ts,js}",
      "src/**/__mocks__/**/*.{ts,js}",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // Both of these describe real problems in app code and are structurally
      // impossible to satisfy in a test that mocks a module.
      //
      // babel-plugin-jest-hoist lifts every jest.mock() call above the import
      // block, so the factories have to be written above it too or they read as
      // running after imports that in fact see the mock. And inside a factory
      // `require` is the only option available: it runs before ESM bindings are
      // initialised, so an import would be in its temporal dead zone.
      //
      // Off here rather than suppressed at ~120 call sites, which buried the
      // signal and left stale directives behind whenever a test was edited.
      "import/first": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Build scripts run in Node, so __dirname, require, and process are valid.
    files: ["scripts/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      "node_modules/",
      "bitchat/",
      "android/",
      "ios/",
      "landing/",
      ".expo/",
      "dist/",
      "build/",
      "coverage/",
    ],
  },
]);
