// Polyfill must be the first import. Required before any @noble/* usage.
import "react-native-get-random-values";

import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>airhop</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
    fontFamily: "monospace",
    fontSize: 18,
  },
});
