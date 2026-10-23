const { withJanus } = require("@janus/metro");

/** Expo apps wrap getDefaultConfig, then withJanus, then NativeWind. */
module.exports = withJanus({
  transformer: {},
  resolver: {},
});
