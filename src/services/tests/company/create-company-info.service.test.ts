/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { CompanyService } from "../..";
import { CreateCompanyByLocalDto, CreateCompanyInfoDto } from "../../../dtos";
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

describe("create-company-info Test", () => {
  const companyService = Container.get(CompanyService);
  it("If created, return info", async () => {
    const data = {
      email: "company@gmail.com",
      password: "company",
    } as CreateCompanyByLocalDto;

    const company = await companyService.createCompany(data);

    const companyInfoData: CreateCompanyInfoDto = {
      name: "회사명",
      introduce: "회사소개 블라블라",
      founded_at: convertDateToTimestamp(),
      member: 11,
      email: "test@gmail.com",
      phone_number: "010-1234-1234",
      address: "주소 주소",
    };

    const spy = jest.spyOn(companyService, "createCompanyInfo");
    const companyInfo = await companyService.createCompanyInfo(
      company.insertId,
      companyInfoData
    );

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(company.insertId, companyInfoData);

    expect(companyInfo.affectedRows).toEqual(1);
  });
});
