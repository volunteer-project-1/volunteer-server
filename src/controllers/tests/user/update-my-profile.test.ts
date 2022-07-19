import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { UserService } from "../../../services";

beforeAll(async () => {
  await Container.get(MySQL).connect();
});

beforeEach(async () => {
  const email = "ehgks0083@gmail.com";

  const userService = Container.get(UserService);
  await userService.createUserBySocial(email);
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
  //   await Container.get(Redis).closeRedis();
  jest.clearAllMocks();
});

afterAll(async () => {
  await Container.get(MySQL).closePool();
});

describe("updateMyProfile test", () => {
  const URL = "/api/v1/user";

  it("PATCH '/profile', If no body, return 400", async () => {
    const res = await request(await startApp())
      .patch(`${URL}/profile`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("PATCH '/profile',If Update Successful, return 204", async () => {
    const res = await request(await startApp())
      .patch(`${URL}/profile`)
      .send({ name: "DoHan Kim" });

    expect(res.status).toBe(204);
  });
});
