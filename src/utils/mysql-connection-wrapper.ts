import type { PoolConnection, RowDataPacket, OkPacket } from "mysql2/promise";

type dbDefaults = RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[];
type dbQuery<T> = T & dbDefaults;

// eslint-disable-next-line consistent-return
export async function queryWrapper<T>(
  { query, values }: { query: string; values?: string[] },
  conn: PoolConnection
): Promise<T | undefined> {
  try {
    await conn.beginTransaction();
    const [rows, _] = await conn.query<dbQuery<T>>(query, values || undefined);
    await conn.commit();

    return rows;
  } catch (error) {
    await conn.rollback();
  } finally {
    conn.release();
  }
}
