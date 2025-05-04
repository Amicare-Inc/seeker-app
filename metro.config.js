// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Apply your custom config changes here
config.resolver.unstable_enablePackageExports = false;

module.exports = config;