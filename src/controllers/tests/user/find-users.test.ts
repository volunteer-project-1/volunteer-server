import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { UserService } from "../../../services";

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

describe("findUsers test", () => {
  const URL = "/api/v1/user";
  const userService = Container.get(UserService);
  it("GET '/',If Users Not Founded, return 404", async () => {
    const res = await request(await startApp()).get(`${URL}`);

    expect(res.status).toBe(404);
  });

  it("GET '/', If Users Founded, return 200", async () => {
    await userService.createUserBySocial("ehgks0083@gmail.com");
    await userService.createUserBySocial("ehgks00@gmail.com");

    const res = await request(await startApp()).get(`${URL}`);

    expect(res.status).toBe(200);
  });
});
