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
    // Right-to-left safety, enforced rather than reviewed.
    //
    // Ten physical properties had accumulated across 49 screens by the time the
    // first RTL catalog was written. That is a good ratio for a hand-followed
    // rule and a bad one for a rule nothing checks, because each of them is
    // invisible until somebody opens the app in Arabic: a badge on the wrong
    // side of a glyph, a message tail pointing away from its sender.
    //
    // React Native flips the logical forms on its own, so the fix is always to
    // name the edge logically. `textAlign` is the exception: it has no logical
    // "end", so the trailing edge comes from `textAlignEnd` in i18n/layout.ts
    // and the leading edge is "auto", which follows the text's own direction.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/i18n/layout.ts", "src/features/discovery/radar-view.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Property[key.name=/^(marginLeft|marginRight|paddingLeft|paddingRight|borderLeftWidth|borderRightWidth|borderLeftColor|borderRightColor|borderTopLeftRadius|borderTopRightRadius|borderBottomLeftRadius|borderBottomRightRadius)$/]",
          message:
            "Physical style property. Use the logical form (marginStart/marginEnd, paddingStart/paddingEnd, borderStartWidth/borderEndWidth, borderTopStartRadius/borderTopEndRadius, borderBottomStartRadius/borderBottomEndRadius) so it flips in Arabic, Persian and Urdu.",
        },
        {
          selector:
            "Property[key.name='textAlign'][value.value=/^(left|right)$/]",
          message:
            'textAlign has no logical form in React Native. Use textAlignEnd from @i18n/layout for the trailing edge, or "auto" for the leading edge.',
        },
        {
          // A bare toLocaleString() asks the DEVICE for its locale, which is
          // not the same thing as the language the app is being read in, and
          // diverges the moment there is a picker. It was already wrong before
          // that: on a phone set to Arabic or Hindi it rendered wallet balances
          // in Arabic-Indic or Devanagari digits, inside the monospace face,
          // next to a Latin "sat".
          //
          // src/utils/format.ts is the one place that decides this, and it
          // pins machine data to Latin digits with the app language's grouping
          // separator. Everything else goes through it.
          selector:
            "CallExpression > MemberExpression[property.name=/^toLocale(String|DateString|TimeString)$/]",
          message:
            "Reads the device locale, not the app's language. Use formatNumber, formatAmount or one of the date formatters from @utils/format.",
        },
      ],
    },
  },
  {
    // format.ts owns the decision, and the benchmarks print to a terminal
    // rather than to a user.
    files: ["src/utils/format.ts", "src/**/__benchmarks__/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": "off",
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
