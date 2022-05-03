import { plainToInstance } from "class-transformer";
import { Service } from "typedi";
import {
  COMPANY_HISTORY_TABLE,
  COMPANY_INFO_TABLE,
  USER_METAS_TABLE,
  USER_TABLE,
} from "../constants";
import { findOneOrWhole, insert, MySQL, update } from "../db";
import {
  CreateCompanyHistoryDto,
  CreateCompanyInfoDto,
  FindCompanyDto,
  FindCompanyHistoryDto,
  FindCompanyInfoDto,
  UpdateCompanyHistoryDto,
  UpdateCompanyInfoDto,
} from "../dtos";
import { ICompany, IComapnyDAO, ICreateCompany } from "../types";

@Service()
export class CompanyDAO implements IComapnyDAO {
  constructor(private readonly mysql: MySQL) {}

  async createCompany({ email, password, salt }: ICreateCompany) {
    const conn = await this.mysql.getConnection();

    const companyQuery = `
        INSERT INTO ${USER_TABLE} (email, password, salt) VALUES(?, ?, ?);
        `;

    const [result] = await insert(
      { query: companyQuery, values: [email, password, salt] },
      conn
    )();

    return result;
  }

  async findCompanyById(id: number) {
    const conn = await this.mysql.getConnection();
    const query = `
        SELECT * 
        FROM ${USER_TABLE} 
        WHERE id = ? 
        LIMIT 1`;

    const [rows] = await findOneOrWhole({ query, values: [id] }, conn)();

    if (!rows.length) {
      return undefined;
    }
    return plainToInstance(FindCompanyDto, rows[0]);
  }

  async findCompanyInfo(id: number) {
    const conn = await this.mysql.getConnection();
    const query = `
        SELECT * 
        FROM ${COMPANY_INFO_TABLE} 
        WHERE id = ? 
        LIMIT 1`;

    const [rows] = await findOneOrWhole({ query, values: [id] }, conn)();

    if (!rows.length) {
      return undefined;
    }
    return plainToInstance(FindCompanyInfoDto, rows[0]);
    // return rows[0] as ICompanyInfo;
  }

  async findCompanyHistory(id: number) {
    const conn = await this.mysql.getConnection();
    const query = `
    SELECT * 
    FROM ${COMPANY_HISTORY_TABLE} 
    WHERE id = ? 
    LIMIT 1`;

    const [rows] = await findOneOrWhole({ query, values: [id] }, conn)();

    if (!rows.length) {
      return undefined;
    }
    return plainToInstance(FindCompanyHistoryDto, rows[0]);
  }

  async findCompanyList({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }): Promise<ICompany[] | undefined> {
    const pool = this.mysql.getPool();
    const TYPE = "company";

    const subQuery = `
    SELECT * 
    FROM ${USER_METAS_TABLE} 
    WHERE type = ?`;

    const query = `
    SELECT C.* 
    FROM ${USER_TABLE} AS C 
    JOIN (${subQuery}) AS M ON M.user_id = C.id 
    WHERE C.id >= ? 
    ORDER BY C.id 
    LIMIT ?`;

    const [rows] = await findOneOrWhole(
      { query, values: [TYPE, start, limit] },
      pool
    )();

    if (!rows.length) {
      return undefined;
    }

    return rows as ICompany[];
  }

  async createCompanyInfo(companyId: number, data: CreateCompanyInfoDto) {
    const conn = this.mysql.getPool();

    const companyInfoField = Object.keys(data).concat("user_id");

    const query = `
    INSERT INTO ${COMPANY_INFO_TABLE} 
    (${companyInfoField})
    VALUES (?)`;

    const [result] = await insert(
      { query, values: [Object.values<any>(data).concat(companyId)] },
      conn
    )();

    if (result.affectedRows === 0) {
      throw new Error();
    }

    return result;
  }

  async updateCompanyInfo(id: number, data: UpdateCompanyInfoDto) {
    const conn = this.mysql.getPool();

    const query = `
        UPDATE ${COMPANY_INFO_TABLE} 
        SET ?
        WHERE id = ?`;

    const [result] = await update({ query, values: [data, id] }, conn)();

    return result;
  }

  async createCompanyHistory(companyId: number, data: CreateCompanyHistoryDto) {
    const conn = this.mysql.getPool();

    const companyHistoryField = Object.keys(data).concat("user_id");

    const query = `
    INSERT INTO ${COMPANY_HISTORY_TABLE} 
    (${companyHistoryField})
    VALUES (?)`;

    const [result] = await insert(
      { query, values: [Object.values<any>(data).concat(companyId)] },
      conn
    )();

    if (result.affectedRows === 0) {
      throw new Error();
    }

    return result;
  }

  async updateCompanyHistory(id: number, data: UpdateCompanyHistoryDto) {
    const conn = this.mysql.getPool();

    const query = `
        UPDATE ${COMPANY_HISTORY_TABLE} 
        SET ?
        WHERE id = ?`;

    const [result] = await update({ query, values: [data, id] }, conn)();

    return result;
  }
}
