// Expo's default Metro config, unwrapped. Path aliases come from tsconfig.json,
// which expo/metro-config reads directly, so nothing is declared twice here.
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Keep the native build trees out of Metro's file map.
//
// Metro crawls and watches the whole project and does not read .gitignore, so
// native/arti/target and .native-build, several gigabytes of Rust and Go
// intermediates, are walked on every start. Worse than slow while a native build
// is running: cargo deletes its temporary files as it goes, and a watch on one
// that has vanished throws ENOENT and takes the bundler down.
//
// Both separators, because these run on Windows as well as macOS and Linux.
config.resolver.blockList = [
  ...[config.resolver.blockList ?? []].flat(),
  /[\\/]native[\\/]arti[\\/]target[\\/]/,
  /[\\/]\.native-build[\\/]/,
];

module.exports = config;
