jest.mock("../src/middlewares/auth.ts", () => {
  const orig = jest.requireActual("../src/middlewares/auth.ts");

  return {
    __esmodule: true,
    ...orig,
    isAuthenticate: jest.fn(async (req, _res, next) => {
      const user = { id: 1, email: "ehgks0083@gmail.com" };
      req.user = user;
      next();
    }),

    isCompanyAuthenticate: jest.fn(async (req, _res, next) => {
      req.user = { id: 1, email: "company@gmail.com", type: "company" };
      next();
    }),
  };
});
