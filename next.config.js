const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    disable: process.env.NODE_ENV === "development", // Disable PWA in development
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "http-calls",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
        },
      },
      {
        urlPattern: /\/_next\/image/,
        handler: "CacheFirst",
        options: {
          cacheName: "next-image-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          },
        },
      },
      {
        urlPattern: /^\/$/,
        handler: "NetworkFirst",
        options: {
          cacheName: "main-route",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
          },
        },
      },
      {
        urlPattern: /\/_next\/static\/css\//,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "global-css-cache",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  });
  
  module.exports = withPWA({
    reactStrictMode: true,
    compiler: {
      removeConsole: process.env.NODE_ENV !== "development",
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
  });
  