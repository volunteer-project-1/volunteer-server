/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { CompanyService } from "../..";
import { CreateCompanyByLocalDto, UpdateCompanyDto } from "../../../dtos";
import { BadReqError } from "../../../lib";
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

describe("update-company Test", () => {
  const companyService = Container.get(CompanyService);
  //   it("If duplicated created, return company", async () => {
  //     const data: ICreateCompany = {
  //       email: "company@gmail.com",
  //       password: "company",
  //       name: "회사명",
  //     };

  //     const spy = jest.spyOn(companyService, "createCompany");

  //     await companyService.createCompany(data);
  //     try {
  //       await companyService.createCompany(data);
  //       throw new BadReqError("You Should not reach this");
  //     } catch (e) {
  //       expect(spy).toBeCalled();
  //       expect(spy).toBeCalledWith(data);

  //       //   expect(e.message).toEqual(expect.stringContaining("Duplicate"));
  //       expect(e).not.toBeInstanceOf(BadReqError);
  //     }
  //   });

  it("If created, return company", async () => {
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };

    const company = await companyService.createCompany(data);

    const spy = jest.spyOn(companyService, "updateCompany");
    const updateData: UpdateCompanyDto = {
      name: "회사명2",
      introduce: "회사 소개~",
    };

    const updatedCompany = await companyService.updateCompany(
      company.insertId,
      updateData
    );

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(company.insertId, updateData);

    expect(updatedCompany.affectedRows).not.toBe(0);
  });
});
