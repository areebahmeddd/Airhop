// Expo's default Metro config, unwrapped. Path aliases come from tsconfig.json,
// which expo/metro-config reads directly, so nothing is declared twice here.
const { getDefaultConfig } = require("expo/metro-config");

module.exports = getDefaultConfig(__dirname);
