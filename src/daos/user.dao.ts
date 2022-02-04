import { OkPacket } from "mysql2/promise";
import { Service } from "typedi";
import { IUserDAO, IUser } from "../types/user";
import { find, findOne, insert, MySQL } from "../utils";

const USER_TABLE = "users";
const USER_METAS_TABLE = "user_metas";

@Service()
class UserDAO implements IUserDAO {
  constructor(private readonly mysql: MySQL) {}

  async findOne(id: number): Promise<IUser | undefined> {
    const query = `Select * FROM ${USER_TABLE} WHERE id=?`;
    const result = await findOne<IUser>({ query, values: [String(id)] });

    if (!result) {
      return undefined;
    }
    return result;
  }

  async findAll(): Promise<IUser[] | undefined> {
    const query = `Select * FROM ${USER_TABLE}`;
    return find<IUser[]>({ query });
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const query = `Select * FROM ${USER_TABLE} WHERE email=?`;

    const result = await findOne<IUser>({ query, values: [email] });

    if (!result) {
      return undefined;
    }
    return result;
  }

  async create(email: string): Promise<OkPacket> {
    const userQuery = `
        INSERT INTO ${USER_TABLE} (email) VALUES(?);
        `;

    const user = await insert({ query: userQuery, values: [email] });

    const userMetaQuery = `
        INSERT INTO ${USER_METAS_TABLE} (user_id) VALUES (?);
        `;

    await insert({ query: userMetaQuery, values: [user!.insertId] });

    return user!;
  }
}

export default UserDAO;
