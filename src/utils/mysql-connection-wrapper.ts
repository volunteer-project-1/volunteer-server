import type {
  OkPacket,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import colors from "colors";
import Container from "typedi";
import { logger } from "./logger";
import { MySQL } from ".";

type dbDefaults =
  | RowDataPacket[]
  | RowDataPacket[][]
  | OkPacket
  | OkPacket[]
  | ResultSetHeader;

type Query = { query: string; values?: any[] };

// eslint-disable-next-line consistent-return
async function queryWrapper<T extends dbDefaults>(
  { query, values }: Query,
  conn: PoolConnection
): Promise<T | undefined> {
  try {
    await conn.beginTransaction();
    const [rows, _] = await conn.query<T>(query, values);
    await conn.commit();

    return rows;
  } catch (error) {
    logger.error(colors.blue(JSON.stringify(error)));
    await conn.rollback();
  } finally {
    conn.release();
  }
}

export async function findOne<T>({
  query,
  values,
}: Query): Promise<T | undefined> {
  const conn = await Container.get(MySQL).getConnection();
  const res = await queryWrapper<T & RowDataPacket[]>({ query, values }, conn!);
  return res![0] as T;
}

export async function update({
  query,
  values,
}: Query): Promise<ResultSetHeader | undefined> {
  const conn = await Container.get(MySQL).getConnection();
  return queryWrapper<ResultSetHeader>({ query, values }, conn!);
}

export async function find<T>({
  query,
  values,
}: Query): Promise<T | undefined> {
  const conn = await Container.get(MySQL).getConnection();
  return queryWrapper<T & RowDataPacket[]>({ query, values }, conn!);
}

export async function insert({
  query,
  values,
}: Query): Promise<OkPacket | undefined> {
  const conn = await Container.get(MySQL).getConnection();
  return queryWrapper<OkPacket>({ query, values }, conn!);
}
