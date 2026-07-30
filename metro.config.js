// Expo's default Metro config, unwrapped.
//
// This was `withNativeWind(config, { input: "./global.css" })`, whose only job
// was to compile a global.css that consisted of three @tailwind directives and
// was never imported by a single source file. See babel.config.js for why the
// whole NativeWind layer went.
const { getDefaultConfig } = require("expo/metro-config");

module.exports = getDefaultConfig(__dirname);
