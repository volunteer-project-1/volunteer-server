jest.mock("./src/utils/logger.ts", () => {
  const orig = jest.requireActual("./src/utils/logger.ts");

  return {
    __esmodule: true,
    ...orig,
    logger: {
      error: jest.fn(),
      info: jest.fn(),
    },
  };
});
