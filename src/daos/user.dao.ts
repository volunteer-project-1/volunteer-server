import { Service } from "typedi";
import {
  IUserDAO,
  IUser,
  IReturnFindMyProfile,
  IUpdateProfile,
} from "../types";
import { findOneOrWhole, insert, MySQL, update } from "../db";
import { USER_METAS_TABLE, USER_PROFILE_TABLE, USER_TABLE } from "../constants";
import { CreateUserByLocalDto } from "../dtos";

@Service()
export class UserDAO implements IUserDAO {
  constructor(private readonly mysql: MySQL) {}

  async findMyProfile(id: number): Promise<IReturnFindMyProfile> {
    const pool = this.mysql.getPool();

    const subQuery1 = `
        SELECT user_id, json_object('id', M.id, 'is_verified', M.is_verified, 'type', M.type) AS user_meta
        FROM ${USER_METAS_TABLE} AS M
        WHERE user_id = ?
        GROUP BY user_id
        LIMIT 1
    `;
    const subQuery2 = `
        SELECT user_id, json_object('id', P.id, 'name', P.name, 'address', P.address, 'birthday', P.birthday) AS profile
        FROM ${USER_PROFILE_TABLE} AS P
        WHERE user_id = ?
        GROUP BY user_id
        LIMIT 1
    `;

    const query = `
        SELECT 
            U.id, U.email,
            m.user_meta,
            p.profile
        FROM ${USER_TABLE} AS U
        JOIN (${subQuery1}) AS m ON m.user_id = U.id
        JOIN (${subQuery2}) AS p ON p.user_id = U.id
        WHERE U.id = ?
        LIMIT 1;
    `;

    const [rows] = await findOneOrWhole(
      {
        query,
        values: [id, id, id],
      },
      pool
    )();

    return rows[0] as IReturnFindMyProfile;
  }

  async updateMyProfile(id: number, { profile }: IUpdateProfile) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${USER_PROFILE_TABLE} 
        SET ?
        WHERE user_id=?
    `;

    return update(
      {
        query,
        values: [profile, id],
      },
      pool
    )();
  }

  async findOneById(id: number): Promise<IUser | undefined> {
    const pool = this.mysql.getPool();
    const query = `Select id, email, created_at, updated_at FROM ${USER_TABLE} WHERE id=? LIMIT 1`;
    const [rows] = await findOneOrWhole({ query, values: [id] }, pool)();

    return rows[0] as IUser;
  }

  async find({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }): Promise<IUser[] | undefined> {
    const pool = this.mysql.getPool();
    // TODO 페이지네이션 나중에 추가
    const query = `
        Select id, email, created_at, updated_at 
        FROM ${USER_TABLE} 
        WHERE id >= ? ORDER BY id LIMIT ?`;

    // const query = `Select * FROM ${USER_TABLE}`;
    const [rows] = await findOneOrWhole(
      { query, values: [start, limit] },
      pool
    )();
    if (rows.length === 0) {
      return undefined;
    }

    return rows as IUser[];
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const pool = this.mysql.getPool();
    const query = `Select * FROM ${USER_TABLE} WHERE email=? LIMIT 1`;

    const [rows] = await findOneOrWhole({ query, values: [email] }, pool)();

    return rows[0] as IUser;
  }

  async createUserBySocial(email: string) {
    const conn = await this.mysql.getConnection();

    try {
      await conn.beginTransaction();

      const userQuery = `
        INSERT INTO ${USER_TABLE} (email) VALUES(?);
        `;
      const [createUser] = await insert(
        { query: userQuery, values: [email] },
        conn
      )();

      const userMetaQuery = `
        INSERT INTO ${USER_METAS_TABLE} (user_id) VALUES (${createUser.insertId});
        `;
      const [createUserMeta] = await insert({ query: userMetaQuery }, conn)();

      const userProfileQuery = `
            INSERT INTO ${USER_PROFILE_TABLE} (user_id) VALUES (${createUser.insertId});
        `;

      const [createUserProfile] = await insert(
        { query: userProfileQuery },
        conn
      )();

      await conn.commit();

      return {
        user: createUser,
        meta: createUserMeta,
        profile: createUserProfile,
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }

  async createUserByLocal({
    email,
    password,
    salt,
  }: CreateUserByLocalDto & { salt: string }) {
    const conn = await this.mysql.getConnection();

    try {
      await conn.beginTransaction();

      const userQuery = `
        INSERT INTO ${USER_TABLE} (email, password, salt) VALUES(?, ?, ?);
        `;

      const [createUser] = await insert(
        { query: userQuery, values: [email, password, salt] },
        conn
      )();

      const userMetaQuery = `
          INSERT INTO ${USER_METAS_TABLE} (user_id) VALUES (${createUser.insertId});
          `;

      const [createUserMeta] = await insert({ query: userMetaQuery }, conn)();

      const userProfileQuery = `
              INSERT INTO ${USER_PROFILE_TABLE} (user_id) VALUES (${createUser.insertId});
              `;

      const [createUserProfile] = await insert(
        { query: userProfileQuery },
        conn
      )();

      await conn.commit();

      return {
        user: createUser,
        meta: createUserMeta,
        profile: createUserProfile,
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
  }
}
