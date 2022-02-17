import type {
  FieldPacket,
  OkPacket,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import colors from "colors";
import { logger } from "./logger";
import { DuplicateError } from ".";

type dbDefaults =
  | RowDataPacket[]
  | RowDataPacket[][]
  | OkPacket
  | OkPacket[]
  | ResultSetHeader;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryFunction<T = any> = () => Promise<
  [T & dbDefaults, FieldPacket[]]
>;

// eslint-disable-next-line consistent-return
export async function queryTransactionWrapper<T = any>(
  queries: QueryFunction[],
  conn: PoolConnection
): Promise<[T, FieldPacket[]][] | undefined> {
  try {
    await conn.beginTransaction();

    const executedQueries = [];
    for (const query of queries) {
      executedQueries.push(await query());
    }

    await conn.commit();
    return executedQueries;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(colors.blue(JSON.stringify(error)));
    await conn.rollback();
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      throw new DuplicateError(error.sqlMessage);
    }
  } finally {
    conn.release();
  }
}
