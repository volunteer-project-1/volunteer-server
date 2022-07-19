/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { CompanyService } from "../..";
import {
  CreateCompanyByLocalDto,
  CreateCompanyHistoryDto,
} from "../../../dtos";
import { convertDateToTimestamp } from "../../../utils";
import { ICreateCompany } from "../../../types";

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

describe("create-company-history Test", () => {
  const companyService = Container.get(CompanyService);
  it("If created, return companyHistory", async () => {
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };

    const company = await companyService.createCompany(data);

    const companyHistoryData: CreateCompanyHistoryDto = {
      content: "블라블라 VC 투자",
      history_at: convertDateToTimestamp(),
    };

    const spy = jest.spyOn(companyService, "createCompanyHistory");
    const companyHistory = await companyService.createCompanyHistory(
      company.insertId,
      companyHistoryData
    );

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(company.insertId, companyHistoryData);

    expect(companyHistory.affectedRows).toEqual(1);
  });
});
