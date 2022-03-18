jest.mock("./src/middlewares/multer", () => {
  const orig = jest.requireActual("./src/middlewares/multer");

  return {
    ...orig,
    upload: {
      single: () => {
        return (req: any, res: any, next: any) => {
          req.file = {
            originalname: "sample.name",
            mimetype: "sample.type",
            path: "sample.url",
            key: `${Date.now()}.mp4`,
            buffer: Buffer.from("whatever"), // this is required since `formData` needs access to the buffer
          };
          req.files = [
            {
              originalname: "sample.name",
              mimetype: "sample.type",
              key: `${Date.now()}.mp4`,
              path: "sample.url",
              buffer: Buffer.from("whatever"), // this is required since `formData` needs access to the buffer
            },
          ];
          return next();
        };
      },
    },
    // getSignedUrl: jest.fn().mockReturnValue("mocked-url"),
  };
});
