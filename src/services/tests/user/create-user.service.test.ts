/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaPromise } from "@prisma/client";
import { UserService } from "../..";
import { Prisma } from "../../../db";

let prisma: Prisma;
beforeAll(async () => {
  prisma = Container.get(Prisma);
  await prisma.client.$connect();
});

afterEach(async () => {
  const transactions: PrismaPromise<any>[] = [];
  transactions.push(prisma.client.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

  const tablenames = await prisma.client.$queryRawUnsafe<
    Array<{ TABLE_NAME: string }>
  >(
    `SELECT TABLE_NAME from information_schema.TABLES WHERE TABLE_SCHEMA = '${process.env.MYSQL_DATABASE}';`
  );

  for (const { TABLE_NAME } of tablenames) {
    if (TABLE_NAME !== "_prisma_migrations") {
      try {
        transactions.push(
          prisma.client.$executeRawUnsafe(`TRUNCATE ${TABLE_NAME};`)
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }

  transactions.push(prisma.client.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

  try {
    await prisma.client.$transaction(transactions);
  } catch (error) {
    console.log({ error });
  }

  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.client.$disconnect();
});

describe("createUserBySocial Test", () => {
  const userService = Container.get(UserService);
  it("If success return {user, userMetas, profiles}", async () => {
    const email = "ehgks0083@gmail.com";
    const spy = jest.spyOn(userService, "createUserBySocial");

    const { user, userMetas, profiles } = await userService.createUserBySocial(
      email
    );

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(email);

    expect(user.email).toEqual(email);

    expect(userMetas).not.toBeNull();
    expect(profiles).not.toBeNull();

    // expect(profiles).toEqual(1);
  });
});
