jest.mock("../src/middlewares/set-off-keep-alive.ts", () => {
  return { setOffKeepAlive: jest.fn() };
});
