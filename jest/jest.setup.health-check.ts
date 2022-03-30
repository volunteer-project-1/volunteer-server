jest.mock("../src/utils/health-check.ts", () => {
  return { terminusOption: jest.fn() };
});
