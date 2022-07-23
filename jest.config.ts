// eslint-disable-next-line import/no-import-module-exports
import type { Config } from "@jest/types";
// import fs from "fs";
// const swcConfig = JSON.parse(fs.readFileSync(`${__dirname}/.swcrc`, "utf-8"));

const config: Config.InitialOptions = {
  roots: ["<rootDir>/src/"],
  clearMocks: true,
  // preset: "@swc/jest",
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json"],
  transform: {
    // "^.+\\.ts$": ["@swc/jest", { ...swcConfig }],
    "^.+\\.ts$": "@swc/jest",
    // "^.+\\.ts$": "ts-jest",
  },
  testRegex: "\\.test\\.ts$",
  globals: {
    // "@swc/jest": {
    "ts-jest": {
      diagnostics: true,
    },
  },
  testTimeout: 30000,
  setupFilesAfterEnv: [
    "./jest/jest.setup.logger.ts",
    // "./jest/jest.setup.set-off-keep-alive.ts",
    "./jest/jest.setup.terminus.ts",
    "./jest/jest.setup.health-check.ts",
    "./jest/jest.setup.redis-mock.ts",
    "./jest/jest.setup.passport.ts",
    "./jest/jest.setup.aws-sdk.ts",
    "./jest/jest.setup.multer.ts",
    "./jest/jest.setup.authenticate.ts",
    // "./jest/singletone.ts",
  ],
};
export default config;
