module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  setupFilesAfterEnv: [
    "<rootDir>/tests/__helper/setupTests.ts",
    "<rootDir>/tests/__helper/mockDb.ts",
  ],
  moduleNameMapper: {
    "@/(.*)$": ["<rootDir>/src/$1"],
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "./tsconfig.test.json" }],
  },
};
