import type { PoolConnection } from "mysql2/promise";

type AlwaysArray<T> = T extends (infer R)[] ? R[] : T[];

// eslint-disable-next-line consistent-return
export async function queryWrapper<T>(
  { query, values }: { query: string; values?: string[] },
  conn: PoolConnection
): Promise<AlwaysArray<T> | undefined> {
  try {
    await conn.beginTransaction();
    const [rows, _]: [any, any] = await conn.query(query, values);
    await conn.commit();

    return rows;
  } catch (error) {
    await conn.rollback();
  } finally {
    conn.release();
  }
}
