export default {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageProvider: "v8",
  moduleNameMapper: {
    "\\.(scss)$": "<rootDir>/test/empty-module.js"
  },
  roots: [
    "<rootDir>/test/"
  ],

















  testEnvironment: "jsdom",















































  preset: "ts-jest"
};
