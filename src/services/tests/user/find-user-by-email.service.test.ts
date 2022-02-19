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
        WHERE table_schema = 'test' AND table_type = 'BASE TABLE';
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

describe("findUserByEmail Test", () => {
  const userService = Container.get(UserService);
  it("If Not Found return undefined", async () => {
    const email = "ehgks0083@gmail.com";
    const spy = jest.spyOn(userService, "findUserByEmail");

    const result = await userService.findUserByEmail(email);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(email);
    expect(result).toBe(undefined);
  });

  it("returns IUser", async () => {
    const email = "ehgks00@gmail.com";
    await userService.createUser(email);

    const spy = jest.spyOn(userService, "findUserByEmail");

    const result = await userService.findUserByEmail(email);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(email);
    expect(result).toEqual(expect.objectContaining({ email }));
  });
});
