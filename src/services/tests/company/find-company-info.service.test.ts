/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { CompanyService } from "../..";
import { CreateCompanyInfoDto } from "../../../dtos";
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

describe("find-Company-info Test", () => {
  const companyService = Container.get(CompanyService);

  it("If not found, return undefined", async () => {
    // const data = { start: 1, limit: 5 };

    const spy = jest.spyOn(companyService, "findCompanyInfo");

    const results = await companyService.findCompanyInfo(1);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(1);

    expect(results).toBe(undefined);
  });

  it("조회 성공 시, 반환", async () => {
    // const data = { start: 1, limit: 5 };
    const company = await companyService.createCompany({
      email: "company@gmail.com",
      password: "password",
    });

    const companyInfoData: CreateCompanyInfoDto = {
      name: "회사 1",
      introduce: "회사 소개",
      founded_at: convertDateToTimestamp(),
      member: 5,
      email: "company@gmail.com",
      phone_number: "010-1234-1234",
      address: "회사주소",
    };

    const companyInfo = await companyService.createCompanyInfo(
      company.insertId,
      companyInfoData
    );

    const spy = jest.spyOn(companyService, "findCompanyInfo");

    const result = await companyService.findCompanyInfo(companyInfo.insertId);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(companyInfo.insertId);

    expect(result).not.toBeNull();
  });
});
