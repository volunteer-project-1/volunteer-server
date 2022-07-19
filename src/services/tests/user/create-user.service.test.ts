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
