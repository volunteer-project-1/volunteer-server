import { Service } from "typedi";
import { USER_METAS_TABLE, USER_TABLE } from "../constants";
import { findOneOrWhole, MySQL } from "../db";
import { IComapny, IComapnyDAO } from "../types";

@Service()
export class CompanyDAO implements IComapnyDAO {
  constructor(private readonly mysql: MySQL) {}

  async findCompanyList({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }): Promise<IComapny[] | undefined> {
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

    return rows as IComapny[];
  }
}
