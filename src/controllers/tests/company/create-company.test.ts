import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { CreateCompanyByLocalDto } from "../../../dtos";

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

describe("create company api test", () => {
  const URL = "/api/v1/auth/local/signup/company";

  //   const companyService = Container.get(CompanyService);

  it("body dto in valid, return 400", async () => {
    const res = await request(await startApp())
      .post(`${URL}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("if passwordConfirm not valid, return 200", async () => {
    const body: CreateCompanyByLocalDto = {
      email: "company@gmail.com",
      password: "comcomcomcom123!A.",
      passwordConfirm: "comcomcomcom",
    };
    const res = await request(await startApp())
      .post(`${URL}`)
      .send(body);

    expect(res.status).toBe(400);
  });

  it("if success, return 200", async () => {
    const body: CreateCompanyByLocalDto = {
      email: "company@gmail.com",
      password: "comcomcomcom123!A.",
      passwordConfirm: "comcomcomcom123!A.",
    };
    const res = await request(await startApp())
      .post(`${URL}`)
      .send(body);

    expect(res.status).toBe(200);
  });
});
