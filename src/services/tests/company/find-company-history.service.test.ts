/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { CompanyService } from "../..";
import { CreateCompanyHistoryDto, CreateCompanyInfoDto } from "../../../dtos";
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

describe("find-Company-history Test", () => {
  const companyService = Container.get(CompanyService);

  it("If not found, return undefined", async () => {
    const spy = jest.spyOn(companyService, "findCompanyHistory");

    const results = await companyService.findCompanyHistory(1);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(1);

    expect(results).toBe(undefined);
  });

  it("조회 성공 시, 반환", async () => {
    const company = await companyService.createCompany({
      email: "company@gmail.com",
      password: "password",
    });

    const companyHistoryData: CreateCompanyHistoryDto = {
      content: "연혁 1",
      history_at: convertDateToTimestamp(),
    };

    const companyHistory = await companyService.createCompanyHistory(
      company.insertId,
      companyHistoryData
    );

    const spy = jest.spyOn(companyService, "findCompanyHistory");

    const result = await companyService.findCompanyHistory(
      companyHistory.insertId
    );

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(companyHistory.insertId);

    expect(result).not.toBeNull();
  });
});
