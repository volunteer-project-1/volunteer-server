import type {
  FieldPacket,
  OkPacket,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

type dbDefaults =
  | RowDataPacket[]
  | RowDataPacket[][]
  | OkPacket
  | OkPacket[]
  | ResultSetHeader;

type QueryFunction = () => Promise<[dbDefaults, FieldPacket[]]>;

function executeQueries<T extends QueryFunction[]>(queries: [...T]) {
  return queries.reduce(async (promise, query) => {
    const acc = await promise;
    const [row] = await query();
    return [...acc, row];
  }, Promise.resolve([] as dbDefaults[]));
}

export async function queryTransactionWrapper<T extends QueryFunction[]>(
  queries: [...T],
  conn: PoolConnection
) {
  try {
    await conn.beginTransaction();

    const executedQueries = await executeQueries(queries);

    await conn.commit();
    return executedQueries;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
