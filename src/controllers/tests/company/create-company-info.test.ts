import { RowDataPacket } from "mysql2/promise";
import request from "supertest";
import Container from "typedi";
import { startApp } from "../../../app";
import { MySQL } from "../../../db";
import { CreateCompanyByLocalDto, CreateCompanyInfoDto } from "../../../dtos";
import { CompanyService } from "../../../services";
import { convertDateToTimestamp } from "../../../utils";

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

describe("create company info api test", () => {
  const URL = "/api/v1/company";

  const companyService = Container.get(CompanyService);

  it("in valid params, return 400", async () => {
    const params = "in-valid";
    const res = await request(await startApp()).post(`${URL}/${params}/info`);
    //   .send({});

    expect(res.status).toBe(400);
  });

  it("body dto in valid, return 400", async () => {
    const params = 1;
    const res = await request(await startApp())
      .post(`${URL}/${params}/info`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("if success, return 200", async () => {
    const data: CreateCompanyByLocalDto = {
      email: "company@gmail.com",
      password: "comcomcomcom123!A.",
      passwordConfirm: "comcomcomcom123!A.",
    };
    const company = await companyService.createCompany(data);

    const body: CreateCompanyInfoDto = {
      name: "회사명",
      introduce: "회사소개 블라블라",
      founded_at: convertDateToTimestamp(),
      member: 11,
      email: "test@gmail.com",
      phone_number: "010-1234-1234",
      address: "주소 주소",
    };
    const res = await request(await startApp())
      .post(`${URL}/${company.insertId}/info`)
      .send(body);

    expect(res.status).toBe(200);
  });

  //   it("if success, return 200", async () => {
  //     const body: CreateCompanyByLocalDto = {
  //       email: "company@gmail.com",
  //       password: "comcomcomcom123!A.",
  //       passwordConfirm: "comcomcomcom123!A.",
  //     };
  //     const res = await request(await startApp())
  //       .post(`${URL}`)
  //       .send(body);

  //     expect(res.status).toBe(200);
  //   });
});
