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
    "./jest/jest.setup.logger.ts",
    "./jest/jest.setup.redis-mock.ts",
    "./jest/jest.setup.passport.ts",
    "./jest/jest.setup.aws-sdk.ts",
    "./jest/jest.setup.multer.ts",
    "./jest/jest.setup.authenticate.ts",
  ],
};
export default config;
