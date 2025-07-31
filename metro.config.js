// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

/**
 * Patch Metro so it can load Firebase's .cjs files and so it ignores
 * the "exports" field that currently hides the React-Native bundle.
 */
const defaultConfig = getDefaultConfig(__dirname);

// Allow importing *.cjs (Firebase ships some code in this format)
defaultConfig.resolver.sourceExts.push('cjs');

// Disable the package "exports" resolution until Firebase fixes RN bundle export
//   https://github.com/firebase/firebase-js-sdk/issues/7584
// This lets Metro fall back to the CommonJS entry points.
// NOTE: marked unstable_* by Metro team, but the Expo docs recommend it for Firebase.
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;

