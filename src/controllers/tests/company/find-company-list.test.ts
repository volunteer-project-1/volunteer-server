import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { ICompany } from "../../../types";
import { CompanyService } from "../../../services";

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

describe("findCompanyList test", () => {
  const URL = "/api/v1/company";

  const companyService = Container.get(CompanyService);

  it("GET '/', If Query not exists return 400", async () => {
    const res = await request(await startApp()).get(`${URL}`);

    expect(res.status).toBe(404);
  });

  it("GET '/', If Query not a number return 400", async () => {
    const QUERY = { start: "un-valid-query", limit: 4 };
    const res = await request(await startApp())
      .get(`${URL}`)
      .query(QUERY);

    expect(res.status).toBe(400);
  });

  it("GET '/', If company not exist return 204", async () => {
    const QUERY = { start: 1, limit: 4 };

    const res = await request(await startApp())
      .get(`${URL}`)
      .query(QUERY);

    expect(res.status).toBe(204);
  });

  it("GET '/', If company exist return 200", async () => {
    const QUERY = { start: 1, limit: 4 };
    jest
      .spyOn(companyService, "findCompanyList")
      .mockResolvedValue([] as ICompany[]);

    const res = await request(await startApp())
      .get(`${URL}`)
      .query(QUERY);

    expect(res.status).toBe(200);
  });
});
