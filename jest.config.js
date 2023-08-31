module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/tests/helper/mockDb.ts"],
  moduleNameMapper: {
    "@/(.*)$": ["<rootDir>/src/$1"],
  },
};
