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

describe("findUserById Test", () => {
  const userService = Container.get(UserService);
  it("If Not Found return undefined", async () => {
    const id = 1;

    const spy = jest.spyOn(userService, "findUserById");

    const result = await userService.findUserById(id);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);
    expect(result).toBeNull();
  });

  it("If success return IUser", async () => {
    const email = "ehgks0083@gmail.com";
    await userService.createUserBySocial(email);

    const id = 1;

    const spy = jest.spyOn(userService, "findUserById");

    const result = await userService.findUserById(id);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);
    expect(result).toEqual(expect.objectContaining({ id, email }));
  });
});
