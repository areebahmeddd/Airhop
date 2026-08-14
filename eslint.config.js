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
      // eslint-config-expo's bundled eslint-plugin-import loads `typescript` as
      // a resolver instead of eslint-import-resolver-typescript, which crashes
      // on Linux. @typescript-eslint covers these checks more accurately.
      "import/namespace": "off",
      "import/no-unresolved": "off",
      "import/no-duplicates": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      // BOM is harmless on Windows and handled by editors and git.
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
      // Both describe real problems in app code and are impossible to satisfy in
      // a test that mocks a module. babel-plugin-jest-hoist lifts every
      // jest.mock() above the import block, so its factories must be written
      // there too, and inside a factory `require` is the only option: an import
      // would be in its temporal dead zone.
      "import/first": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Build scripts run in Node, so __dirname, require and process are valid.
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
