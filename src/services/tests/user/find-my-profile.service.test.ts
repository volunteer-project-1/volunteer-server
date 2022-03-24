/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { UserService } from "../..";

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

describe("findMyProfile Test", () => {
  const userService = Container.get(UserService);
  it("If not found, return undefined", async () => {
    const id = 1;

    const spy = jest.spyOn(userService, "findMyProfile");

    const result = await userService.findMyProfile(id);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);
    expect(result).toBe(undefined);
  });

  it("'findMyProfile' return 'users', 'profile', 'user_meta' (ReturnFindMyProfileDTO) ", async () => {
    const email = "ehgks0083@gmail.com";
    const id = 1;

    await userService.createUserBySocial(email);

    const spy = jest.spyOn(userService, "findMyProfile");

    const result = await userService.findMyProfile(id);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(id);
    expect(result).toEqual(
      expect.objectContaining({
        id,
        email,
      })
    );
    expect(result.user_meta).toEqual(
      expect.objectContaining({ is_verified: 0, type: "seeker" })
    );
  });
});
