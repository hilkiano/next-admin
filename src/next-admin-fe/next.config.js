const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: false,
  i18n,
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
