// eslint-disable-next-line import/no-import-module-exports
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: "\\.test\\.ts$",
  globals: {
    "ts-jest": {
      diagnostics: true,
    },
  },
  testTimeout: 30000,
  setupFilesAfterEnv: [
    "./jest.setup.logger.ts",
    "./jest.setup.redis-mock.ts",
    "./jest.setup.passport.ts",
    "./jest.setup.aws-sdk.ts",
    "./jest.setup.multer.ts",
    "./jest.setup.authenticate.ts",
  ],
};

export default config;
