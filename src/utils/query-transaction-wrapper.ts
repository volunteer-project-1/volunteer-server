import type {
  FieldPacket,
  OkPacket,
  Pool,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import colors from "colors";
import { logger } from "./logger";

type dbDefaults =
  | RowDataPacket[]
  | RowDataPacket[][]
  | OkPacket
  | OkPacket[]
  | ResultSetHeader;

export type QueryFunction<T = any> = () => Promise<
  [T & dbDefaults, FieldPacket[]]
>;

type AlwaysArray<T> = T extends (infer R)[] ? R[] : T[];
// eslint-disable-next-line consistent-return
export async function queryTransactionWrapper<T = any>(
  queries: QueryFunction[],
  pool: Pool
): Promise<[AlwaysArray<T>, FieldPacket[]][] | undefined> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const executedQueries = await Promise.all(queries.map((query) => query()));

    await conn.commit();
    return executedQueries;
  } catch (error) {
    logger.error(colors.blue(JSON.stringify(error)));
    await conn.rollback();
  } finally {
    conn.release();
  }
}
