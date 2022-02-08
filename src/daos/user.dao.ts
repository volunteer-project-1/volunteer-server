import { Service } from "typedi";
import {
  IUserDAO,
  IUser,
  ReturnFindMyProfileDTO,
  UpdateProfileDTO,
} from "../types/user";
import {
  find,
  findOne,
  insert,
  MySQL,
  queryTransactionWrapper,
  update,
} from "../utils";

const USER_TABLE = "users";
const USER_METAS_TABLE = "user_metas";
const USER_PROFILE = "profiles";

@Service()
export class UserDAO implements IUserDAO {
  constructor(private readonly mysql: MySQL) {}

  async findMyProfile(id: number): Promise<ReturnFindMyProfileDTO | undefined> {
    const conn = await this.mysql.getConnection();
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
    WHERE U.id = ?`;

    const findUserQueryFunction = findOne(
      {
        query,
        values: [id],
      },
      conn
    );

    const executedQueries =
      await queryTransactionWrapper<ReturnFindMyProfileDTO>(
        [findUserQueryFunction],
        conn
      );
    if (!executedQueries) {
      throw new Error();
    }
    const [[rows]] = executedQueries;

    return rows[0];
  }

  async updateMyProfile(id: number, body: UpdateProfileDTO) {
    const conn = await this.mysql.getConnection();

    const query = `
        UPDATE ${USER_PROFILE} 
        SET ?
        WHERE user_id=?
    `;

    const updateUserQueryFunction = update(
      {
        query,
        values: [body, id],
      },
      conn
    );

    await queryTransactionWrapper([updateUserQueryFunction], conn);
  }

  async findOneById(id: number): Promise<IUser | undefined> {
    const conn = await this.mysql.getConnection();
    const query = `Select * FROM ${USER_TABLE} WHERE id=?`;
    const findUserQueryFunction = findOne({ query, values: [id] }, conn);

    const executedQueries = await queryTransactionWrapper<IUser>(
      [findUserQueryFunction],
      conn
    );

    if (!executedQueries) {
      throw new Error();
    }
    const [[rows]] = executedQueries;

    return rows[0];
  }

  async find(): Promise<IUser[] | undefined> {
    const conn = await this.mysql.getConnection();
    const query = `Select * FROM ${USER_TABLE}`;
    const findUsersQueryFunction = find({ query }, conn);

    const executedQueries = await queryTransactionWrapper<IUser[]>(
      [findUsersQueryFunction],
      conn
    );

    if (!executedQueries) {
      throw new Error();
    }
    const [[rows]] = executedQueries;

    return rows;
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const conn = await this.mysql.getConnection();
    const query = `Select * FROM ${USER_TABLE} WHERE email=?`;

    const findUserQueryFunction = findOne({ query, values: [email] }, conn);

    const executedQueries = await queryTransactionWrapper<IUser>(
      [findUserQueryFunction],
      conn
    );
    if (!executedQueries) {
      throw new Error();
    }
    const [[rows]] = executedQueries;

    return rows[0];
  }

  async create(email: string) {
    const conn = await this.mysql.getConnection();
    const userQuery = `
        INSERT INTO ${USER_TABLE} (email) VALUES(?);
        `;

    const createUserQueryFunction = insert(
      { query: userQuery, values: [email] },
      conn
    );

    const userMetaQuery = `
        INSERT INTO ${USER_METAS_TABLE} (user_id) VALUES (Last_insert_id());
        `;

    const createUserMetaQueryFunction = insert({ query: userMetaQuery }, conn);

    await queryTransactionWrapper(
      [createUserQueryFunction, createUserMetaQueryFunction],
      conn
    );
  }
}
