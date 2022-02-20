import { Service } from "typedi";
import {
  IUserDAO,
  IUser,
  ReturnFindMyProfileDTO,
  UpdateProfileDTO,
  IUserCreateDTO,
} from "../types/user";
import { DuplicateError, MySQL, queryTransactionWrapper } from "../utils";
import { findOneOrWhole, insert, update } from "../db";

const USER_TABLE = "users";
const USER_METAS_TABLE = "user_metas";
const USER_PROFILE = "profiles";

@Service()
export class UserDAO implements IUserDAO {
  constructor(private readonly mysql: MySQL) {}

  async findMyProfile(id: number): Promise<ReturnFindMyProfileDTO> {
    const pool = await this.mysql.getPool();
    const query = `
        Select 
            U.id, U.email, 
            M.id AS user_meta_id, M.is_verified, M.type, 
            P.name, P.address, P.birthday
        FROM ${USER_TABLE} AS U 
        LEFT JOIN ${USER_METAS_TABLE} AS M 
            ON U.id = M.user_id 
        LEFT JOIN ${USER_PROFILE} AS P 
            ON U.id = P.user_id 
        WHERE U.id = ?
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
    const pool = await this.mysql.getPool();

    const query = `
        UPDATE ${USER_PROFILE} 
        SET ?
        WHERE user_id=?
    `;

    await update(
      {
        query,
        values: [body, id],
      },
      pool
    )();
  }

  async findOneById(id: number): Promise<IUser | undefined> {
    const pool = await this.mysql.getPool();
    const query = `Select * FROM ${USER_TABLE} WHERE id=?`;
    const [rows] = await findOneOrWhole({ query, values: [id] }, pool)();

    return rows[0] as IUser;
  }

  async find(): Promise<IUser[] | undefined> {
    const pool = await this.mysql.getPool();
    const query = `Select * FROM ${USER_TABLE}`;
    const [rows] = await findOneOrWhole({ query }, pool)();

    return rows as IUser[];
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const pool = await this.mysql.getPool();
    const query = `Select * FROM ${USER_TABLE} WHERE email=?`;

    const [rows] = await findOneOrWhole({ query, values: [email] }, pool)();

    return rows[0] as IUser;
  }

  async create(email: string) {
    const pool = await this.mysql.getPool();
    const userQuery = `
        INSERT INTO ${USER_TABLE} (email) VALUES(?);
        `;

    const createUserQuery = insert({ query: userQuery, values: [email] }, pool);

    const userMetaQuery = `
        INSERT INTO ${USER_METAS_TABLE} (user_id) VALUES (Last_insert_id());
        `;

    const createUserMetaQuery = insert({ query: userMetaQuery }, pool);

    await queryTransactionWrapper([createUserQuery, createUserMetaQuery], pool);
  }

  // :TODO 트랜젝션 제대로 정리
  async createLocal(input: IUserCreateDTO) {
    const pool = await this.mysql.getPool();
    const userQuery = `
        INSERT INTO ${USER_TABLE} (email, password, salt) VALUES(?, ?, ?);
        `;

    try {
      await insert(
        { query: userQuery, values: [input.email, input.password, input.salt] },
        pool
      )();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        throw new DuplicateError("Duplicate Email");
      }
    }

    const userMetaQuery = `
        INSERT INTO ${USER_METAS_TABLE} (user_id) VALUES (Last_insert_id());
        `;

    await insert({ query: userMetaQuery }, pool)();

    // 임시로 true 리턴
    return true;
    // await queryTransactionWrapper([createUserQuery, createUserMetaQuery], pool);
  }
}
