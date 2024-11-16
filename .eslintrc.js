module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-acme`
  extends: ["react-namespace"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
