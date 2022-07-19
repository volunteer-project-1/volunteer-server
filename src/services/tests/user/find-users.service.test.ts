/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { UserService } from "../..";
import { MySQL } from "../../../db";

beforeAll(async () => {
  await Container.get(MySQL).connect();
});

afterEach(async () => {
  const conn = await Container.get(MySQL).getConnection();
  await conn!.query(`SET FOREIGN_KEY_CHECKS=0;`);
  const [rows] = await conn!.query<RowDataPacket[]>(`
    SELECT Concat('TRUNCATE TABLE ', TABLE_NAME, ';') as q
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE table_schema = '${process.env.MYSQL_DATABASE}' AND table_type = 'BASE TABLE';
  `);

  for (const row of rows) {
    await conn!.query(row.q);
  }
  await conn!.query(`SET FOREIGN_KEY_CHECKS=1;`);
  conn?.release();
  jest.clearAllMocks();
});

afterAll(async () => {
  await Container.get(MySQL).closePool();
});

describe("findUsers Test", () => {
  const userService = Container.get(UserService);
  it("If Not Found return empty array", async () => {
    const spy = jest.spyOn(userService, "findUsers");
    const query = { id: 0, limit: 5 };

    const results = await userService.findUsers(query);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(query);
    expect(results).toEqual([]);
  });

  it("If Not Found return users array", async () => {
    const email1 = "ehgks00@gmail.com";
    const email2 = "ehgks0083@gmail.com";
    await userService.createUserBySocial(email1);
    await userService.createUserBySocial(email2);

    const spy = jest.spyOn(userService, "findUsers");

    const query = { id: 0, limit: 5 };

    const results = await userService.findUsers(query);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(query);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: email2 }),
        expect.objectContaining({ email: email1 }),
      ])
    );
  });
});
