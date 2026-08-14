module.exports = function (api) {
  api.cache(true);
  return {
    // Plain babel-preset-expo with React Native's own JSX runtime. Do not route
    // JSX through a styling library's transform: NativeWind's wrapJSX swaps
    // every element type for an interop wrapper whether or not a `className` is
    // used, and that wrapper owns `style`, which breaks the standard
    // `style={({ pressed }) => ...}` callback form.
    presets: ["babel-preset-expo"],
    // reanimated/plugin must stay last, as its docs require.
    plugins: ["react-native-reanimated/plugin"],
  };
};
