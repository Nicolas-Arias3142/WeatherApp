// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

module.exports = wrapWithReanimatedMetroConfig(config);
