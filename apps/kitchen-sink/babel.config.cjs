module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [["@janus/compiler", { platform: process.env.JANUS_PLATFORM ?? "native" }]],
  };
};
