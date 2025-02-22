const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  'png',
  'jpg',
  'jpeg'
);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  assets: path.resolve(__dirname, 'assets'),
};

config.watchFolders = [
  ...config.watchFolders,
  path.resolve(__dirname, 'assets')
];

module.exports = config;