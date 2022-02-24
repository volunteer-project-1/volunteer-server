import {
  OkPacket,
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

type Query = { query: string; values?: any[] };

export function findOneOrWhole(
  { query, values }: Query,
  conn: Pool | PoolConnection
) {
  return () => {
    return conn.query<RowDataPacket[]>(query, values);
  };
}

export function update({ query, values }: Query, conn: Pool | PoolConnection) {
  return () => {
    return conn.query<ResultSetHeader>(query, values);
  };
}

export function insert({ query, values }: Query, conn: Pool | PoolConnection) {
  return () => {
    return conn.query<OkPacket>(query, values);
  };
}
