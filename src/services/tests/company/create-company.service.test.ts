/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { CompanyService } from "../..";
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

describe("create-company Test", () => {
  const companyService = Container.get(CompanyService);
  it("If created, return company, info, history", async () => {
    const data = {
      email: "company@gmail.com",
      password: "company",
    } as CreateCompanyByLocalDto;

    const TRANSACTION_STATUS = 3;

    const spy = jest.spyOn(companyService, "createCompany");

    const { company, info, history } = await companyService.createCompany(data);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(data);

    expect(company.affectedRows).toEqual(1);
    expect(company.serverStatus).toEqual(TRANSACTION_STATUS);

    expect(info.affectedRows).toEqual(1);
    expect(info.serverStatus).toEqual(TRANSACTION_STATUS);

    expect(history.affectedRows).toEqual(1);
    expect(history.serverStatus).toEqual(TRANSACTION_STATUS);
  });
});
