// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Disable unstable package exports
  config.resolver.unstable_enablePackageExports = false;

  return config;
})();

