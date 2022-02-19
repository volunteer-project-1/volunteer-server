/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { UserService } from "../..";
import { UpdateProfileDTO } from "../../../types";

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

describe("updateMyProfile Test", () => {
  const userService = Container.get(UserService);
  it("If success return {affectedRows: 1}", async () => {
    const email = "ehgks0083@gmail.com";
    await userService.createUser(email);

    const id = 1;
    const birthday = new Date();
    const data: UpdateProfileDTO = { name: "Lee", address: "강서구", birthday };

    const spy = jest.spyOn(userService, "updateMyProfile");

    const [result] = await userService.updateMyProfile(id, data);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id, data);
    expect(result.affectedRows).toBe(1);
  });
});
