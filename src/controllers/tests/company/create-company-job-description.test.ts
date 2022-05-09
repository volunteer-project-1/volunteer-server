import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { CreateCompanyByLocalDto } from "../../../dtos";
import { newCompanyJobDescriptionFactory } from "../../../factory";
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

describe("create-company-job-description api test", () => {
  const URL = "/api/v1/company";

  it("In Valid Params", async () => {
    const params = "IN-valid";
    const res = await request(await startApp()).post(
      `${URL}/${params}/job-description`
    );
    expect(res.status).toBe(400);
  });

  it("In valid body dto, return 400", async () => {
    const body = {};
    const res = await request(await startApp())
      .post(`${URL}/1/job-description`)
      .send(body);

    expect(res.status).toBe(400);
  });

  it("if success, return 200", async () => {
    const companyService = Container.get(CompanyService);
    const data: CreateCompanyByLocalDto = {
      email: "company@gmail.com",
      password: "comcomcomcom123!A.",
      passwordConfirm: "comcomcomcom123!A.",
      name: "회사명",
    };

    const body = newCompanyJobDescriptionFactory();

    const company = await companyService.createCompany(data);
    const res = await request(await startApp())
      .post(`${URL}/${company.insertId}/job-description`)
      .send(body);

    expect(res.status).toBe(200);
  });
});
