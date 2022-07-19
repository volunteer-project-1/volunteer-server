/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { RowDataPacket } from "mysql2/promise";
import { Container } from "typedi";
import { MySQL } from "../../../db";
import { CompanyService } from "../..";
import { CreateCompanyByLocalDto } from "../../../dtos";
import { newCompanyJobDescriptionFactory } from "../../../factory";
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

describe("create-company-job-description Test", () => {
  const companyService = Container.get(CompanyService);

  it("If created, return OkPacket", async () => {
    const data: ICreateCompany = {
      email: "company@gmail.com",
      password: "company",
      name: "회사명",
    };

    const company = await companyService.createCompany(data);

    const spy = jest.spyOn(companyService, "createJobDescription");

    const jdData = newCompanyJobDescriptionFactory();
    const { jobDescription, jdSteps, jdDetails, jdWorkCondition, jdWelfares } =
      await companyService.createJobDescription(company.insertId, jdData);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(company.insertId, jdData);

    expect(jobDescription.affectedRows).toBe(1);
    expect(jdSteps.length).toBe(jdData.jd_steps.length);
    expect(jdDetails.length).toBe(jdData.jd_details.length);
    expect(jdWorkCondition.affectedRows).toBe(1);
    expect(jdWelfares.length).toBe(jdData.jd_welfares.length);
  });
});
