import { PrismaPromise } from "@prisma/client";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import Prisma from "../../../db/prisma";
import { UserService } from "../../../services";

let prisma: typeof Prisma;
beforeAll(async () => {
  prisma = Prisma;
  await prisma.$connect();
});

afterEach(async () => {
  const transactions: PrismaPromise<any>[] = [];
  transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

  const tablenames = await prisma.$queryRawUnsafe<
    Array<{ TABLE_NAME: string }>
  >(
    `SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE}';`
  );

  for (const { TABLE_NAME } of tablenames) {
    if (TABLE_NAME !== "_prisma_migrations") {
      try {
        transactions.push(prisma.$executeRawUnsafe(`TRUNCATE ${TABLE_NAME};`));
      } catch (error) {
        console.log({ error });
      }
    }
  }

  transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

  try {
    await prisma.$transaction(transactions);
  } catch (error) {
    console.log({ error });
  }

  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("updateMyProfile test", () => {
  const URL = "/api/v1/user";

  it("PATCH '/profile', If no body, return 400", async () => {
    const res = await request(await startApp())
      .patch(`${URL}/profile`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("PATCH '/profile',If Not Found, return 404", async () => {
    const res = await request(await startApp())
      .patch(`${URL}/profile`)
      .send({ name: "DoHan Kim" });

    expect(res.status).toBe(404);
  });

  it("PATCH '/profile',If Update Successful, return 200", async () => {
    const userService = Container.get(UserService);
    const email = "ehgks0083@gmail.com";
    await userService.createUserBySocial(email);

    const res = await request(await startApp())
      .patch(`${URL}/profile`)
      .send({ name: "DoHan Kim" });

    expect(res.status).toBe(200);
  });
});
