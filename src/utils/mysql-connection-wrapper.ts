import type {
  FieldPacket,
  OkPacket,
  PoolConnection,
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

type Query = { query: string; values?: any[] };

export type QueryFunction<T = any> = () => Promise<
  [T & dbDefaults, FieldPacket[]]
>;

type AlwaysArray<T> = T extends (infer R)[] ? R[] : T[];
// eslint-disable-next-line consistent-return
export async function queryTransactionWrapper<T = any>(
  queries: QueryFunction[],
  conn: PoolConnection
): Promise<[AlwaysArray<T>, FieldPacket[]][] | undefined> {
  try {
    await conn.beginTransaction();
    // await conn.query("START TRANSACTION;");

    const executedQueries = await Promise.all(
      queries.map((query) => {
        return query();
      })
    );

    // await conn.query("COMMIT;");
    await conn.commit();
    return executedQueries;
  } catch (error) {
    logger.error(colors.blue(JSON.stringify(error)));
    await conn.rollback();
  } finally {
    conn.release();
  }
}

export function findOne({ query, values }: Query, conn: PoolConnection) {
  return () => {
    return conn.query<RowDataPacket[]>(query, values);
  };
}

export function find({ query, values }: Query, conn: PoolConnection) {
  return () => {
    return conn.query<RowDataPacket[]>(query, values);
  };
}

export function update({ query, values }: Query, conn: PoolConnection) {
  return () => {
    return conn.query<ResultSetHeader>(query, values);
  };
}

export function insert({ query, values }: Query, conn: PoolConnection) {
  return () => {
    return conn.query<OkPacket>(query, values);
  };
}
