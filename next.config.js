const withPWA = require("next-pwa")({
    dest: "public",

    // 🔥 開発中はPWA無効
    disable: process.env.NODE_ENV === "development",

    register: true,
    skipWaiting: true,
});

module.exports = withPWA({
    reactStrictMode: true,
});