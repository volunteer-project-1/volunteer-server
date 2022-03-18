jest.mock("aws-sdk", () => {
  const orig = jest.requireActual("aws-sdk");

  return {
    ...orig,
    config: {
      loadFromPath: () => jest.fn(),
    },
  };
});
