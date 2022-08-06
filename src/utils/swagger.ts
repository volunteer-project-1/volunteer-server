import swaggerUi from "swagger-ui-express";
import swaggereJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Seeme by Dohan",
      description: "Mr.Dohan made by himself. wonderful",
    },
    servers: [
      {
        url: "http://localhost:3000", // 요청 URL
      },
    ],
  },
  apis: ["./routers/*.js", "./routers/user/*.js"], // Swagger 파일 연동
};

const specs = swaggereJsdoc(options);

export { swaggerUi, specs };
