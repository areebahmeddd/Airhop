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
  },
  {
    ignores: [
      "node_modules/",
      "bitchat/",
      "android/",
      "ios/",
      ".expo/",
      "dist/",
      "build/",
      "coverage/",
    ],
  },
]);
