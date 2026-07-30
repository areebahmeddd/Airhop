module.exports = function (api) {
  api.cache(true);
  return {
    // Plain babel-preset-expo, with React Native's own JSX runtime.
    //
    // This used to route JSX through `jsxImportSource: "nativewind"` plus
    // `nativewind/babel`. Nothing in the app ever used a `className`, but the
    // transform applied regardless: NativeWind's wrapJSX swaps EVERY element
    // type for an interop wrapper unconditionally, and Pressable/View/Text/
    // Image/ScrollView/TextInput/FlatList/Switch are all registered with their
    // mapping pointed at the `style` prop. So every element in every list row
    // paid for a wrapper that had no styles to merge, and a standard React
    // Native API (`style={({ pressed }) => ...}`) silently stopped working
    // because the wrapper owns `style` and cannot merge a function.
    //
    // reanimated/plugin stays last, as its docs require.
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
