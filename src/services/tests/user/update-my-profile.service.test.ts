/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Container } from "typedi";
import { PrismaPromise } from "@prisma/client";
import { Prisma } from "../../../db";
import { UserService } from "../..";
import { IUpdateProfile } from "../../../types";

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

describe("updateMyProfile Test", () => {
  const userService = Container.get(UserService);
  it("If success return {affectedRows: 1}", async () => {
    const email = "ehgks0083@gmail.com";
    await userService.createUserBySocial(email);

    const id = 1;
    const birthday = new Date();
    // const birthday = new Date().toISOString().slice(0, 19).replace("T", " ");
    const data: IUpdateProfile = {
      name: "Lee",
      address: "강서구",
      birthday,
    };

    const spy = jest.spyOn(userService, "updateMyProfile");

    const result = await userService.updateMyProfile(id, data);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id, data);
    expect(result).toEqual(
      expect.objectContaining({
        ...data,
        birthday: data.birthday?.toISOString(),
      })
    );
  });
});
