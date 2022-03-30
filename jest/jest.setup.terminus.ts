jest.mock("@godaddy/terminus", () => {
  return { createTerminus: jest.fn() };
});
