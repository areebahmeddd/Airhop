const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
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
