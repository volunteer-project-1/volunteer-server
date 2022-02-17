import { Service } from "typedi";
import { OkPacket } from "mysql2/promise";
import {
  IUserDAO,
  IUser,
  ReturnFindMyProfileDTO,
  UpdateProfileDTO,
  IUserCreateDTO,
} from "../types/user";
import { queryTransactionWrapper } from "../utils";
import { findOneOrWhole, insert, MySQL, update } from "../db";

const USER_TABLE = "users";
const USER_METAS_TABLE = "user_metas";
const USER_PROFILE_TABLE = "profiles";

@Service()
export class UserDAO implements IUserDAO {
  constructor(private readonly mysql: MySQL) {}

  async findMyProfile(id: number): Promise<ReturnFindMyProfileDTO> {
    const pool = this.mysql.getPool();

    const subQuery1 = `
        SELECT user_id, json_object('id', M.id, 'is_verified', M.is_verified, 'type', M.type) AS user_meta
        FROM ${USER_METAS_TABLE} AS M
        GROUP BY id, user_id
    `;
    const subQuery2 = `
        SELECT user_id, json_object('id', P.id, 'name', P.name, 'address', P.address, 'birthday', P.birthday) AS profile
        FROM ${USER_PROFILE_TABLE} AS P
        GROUP BY id, user_id
    `;

    const query = `
        SELECT 
            U.id, U.email,
            m.user_meta,
            p.profile
        FROM ${USER_TABLE} AS U
        JOIN (${subQuery1}) AS m ON m.user_id = U.id
        JOIN (${subQuery2}) AS p ON p.user_id = U.id
        WHERE U.id = ?;
    `;

    const [rows] = await findOneOrWhole(
      {
        query,
        values: [id],
      },
      pool
    )();

    return rows[0] as ReturnFindMyProfileDTO;
  }

  async updateMyProfile(id: number, body: UpdateProfileDTO) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${USER_PROFILE_TABLE} 
        SET ?
        WHERE user_id=?
    `;

    return update(
      {
        query,
        values: [body, id],
      },
      pool
    )();
  }

  async findOneById(id: number): Promise<IUser | undefined> {
    const pool = this.mysql.getPool();
    const query = `Select * FROM ${USER_TABLE} WHERE id=?`;
    const [rows] = await findOneOrWhole({ query, values: [id] }, pool)();

    return rows[0] as IUser;
  }

  async find(): Promise<IUser[] | undefined> {
    const pool = this.mysql.getPool();
    const query = `Select * FROM ${USER_TABLE}`;
    const [rows] = await findOneOrWhole({ query }, pool)();
    if (rows.length === 0) {
      return undefined;
    }

    return rows as IUser[];
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const pool = this.mysql.getPool();
    const query = `Select * FROM ${USER_TABLE} WHERE email=?`;

    const [rows] = await findOneOrWhole({ query, values: [email] }, pool)();

    return rows[0] as IUser;
  }

  async create(email: string) {
    const conn = await this.mysql.getConnection();

    const LAST_INSERTED_ID = "@last_inserted_id";
    const userQuery = `
        INSERT INTO ${USER_TABLE} (email) VALUES(?);
        `;

    const createUserQuery = insert({ query: userQuery, values: [email] }, conn);
    const setLastInsertedIdQuery = insert(
      { query: `SET ${LAST_INSERTED_ID} := Last_insert_id();` },
      conn
    );

    const userMetaQuery = `
        INSERT INTO ${USER_METAS_TABLE} (user_id) VALUES (${LAST_INSERTED_ID});
        `;

    const createUserMetaQuery = insert({ query: userMetaQuery }, conn);

    const userProfileQuery = `
            INSERT INTO ${USER_PROFILE_TABLE} (user_id) VALUES (${LAST_INSERTED_ID});
            `;

    const createUserProfileQuery = insert({ query: userProfileQuery }, conn);

    const results = await queryTransactionWrapper<OkPacket>(
      [
        createUserQuery,
        setLastInsertedIdQuery,
        createUserMetaQuery,
        createUserProfileQuery,
      ],
      conn
    );

    const user = results![0][0];
    const meta = results![2][0];
    const profile = results![3][0];

    return { user, meta, profile };
  }

  // :TODO 트랜젝션 제대로 정리
  async createLocal(input: IUserCreateDTO) {
    const pool = await this.mysql.getPool();
    const userQuery = `
        INSERT INTO ${USER_TABLE} (email, password, salt) VALUES(?, ?, ?);
        `;

    const createUserQuery = insert(
      { query: userQuery, values: [input.email, input.password, input.salt] },
      pool
    );

    const userMetaQuery = `
        INSERT INTO ${USER_METAS_TABLE} (user_id) VALUES (Last_insert_id());
        `;

    const createUserMetaQuery = insert({ query: userMetaQuery }, pool);

    await queryTransactionWrapper([createUserQuery, createUserMetaQuery], pool);
  }
}
