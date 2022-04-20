import { OkPacket } from "mysql2/promise";
import { Service } from "typedi";
import {
  COMPANY_HISTORY_TABLE,
  COMPANY_INFO_TABLE,
  USER_METAS_TABLE,
  USER_TABLE,
} from "../constants";
import { findOneOrWhole, insert, MySQL } from "../db";
import { ICompany, IComapnyDAO, ICreateCompany } from "../types";
import { queryTransactionWrapper } from "../utils";

@Service()
export class CompanyDAO implements IComapnyDAO {
  constructor(private readonly mysql: MySQL) {}

  async createCompany({ email, password, salt }: ICreateCompany) {
    const conn = await this.mysql.getConnection();

    const LAST_INSERTED_ID = "@last_inserted_id";

    const companyQuery = `
        INSERT INTO ${USER_TABLE} (email, password, salt) VALUES(?, ?, ?);
        `;

    const createCompanyQuery = insert(
      { query: companyQuery, values: [email, password, salt] },
      conn
    );

    const setLastInsertedIdQuery = insert(
      { query: `SET ${LAST_INSERTED_ID} := Last_insert_id();` },
      conn
    );

    const companyInfoQuery = `
          INSERT INTO ${COMPANY_INFO_TABLE} (user_id) VALUES (${LAST_INSERTED_ID});
          `;

    const createCompanyInfoQueryFunction = insert(
      { query: companyInfoQuery },
      conn
    );

    const companyHistoryQuery = `
              INSERT INTO ${COMPANY_HISTORY_TABLE} (user_id) VALUES (${LAST_INSERTED_ID});
              `;

    const createCompanyHistoryQueryFunction = insert(
      { query: companyHistoryQuery },
      conn
    );
    const results = await queryTransactionWrapper(
      [
        createCompanyQuery,
        setLastInsertedIdQuery,
        createCompanyInfoQueryFunction,
        createCompanyHistoryQueryFunction,
      ],
      conn
    );

    return {
      company: results[0] as OkPacket,
      info: results[2] as OkPacket,
      history: results[3] as OkPacket,
    };
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
}
