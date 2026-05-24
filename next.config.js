const path = require("path");

const withPWA = require("next-pwa")({
    dest: "public",

    // 🔥 開発中はPWA無効
    disable: process.env.NODE_ENV === "development",

    register: true,
    skipWaiting: true,
});

module.exports = withPWA({
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || {};
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');

        // Ensure server chunk filenames are placed under `chunks/` so
        // the webpack runtime can require them correctly during prerender.
        config.output = config.output || {};
        config.output.chunkFilename = config.output.chunkFilename || 'chunks/[name].js';

        return config;
    },
});