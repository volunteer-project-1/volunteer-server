import { Service } from "typedi";
import { IUserDAO, IUser } from "../types/user";
import { MySQL, queryWrapper } from "../utils";

const USER_TABLE = "users";

@Service()
class UserDAO implements IUserDAO {
  constructor(private readonly mysql: MySQL) {}

  async findOne(id: number): Promise<IUser | undefined> {
    const conn = await this.mysql.getConnection();
    const query = `Select * FROM ${USER_TABLE} WHERE id=?`;
    const values = [String(id)];
    const result = await queryWrapper<IUser>({ query, values }, conn!);

    if (!result) {
      return undefined;
    }
    return result[0];
  }

  async findAll(): Promise<IUser[] | undefined> {
    const conn = await this.mysql.getConnection();
    const query = `Select * FROM ${USER_TABLE}`;
    return queryWrapper<IUser[]>({ query }, conn!);
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const conn = await this.mysql.getConnection();
    const query = `Select * FROM ${USER_TABLE} WHERE email=?`;
    const values = [email];

    const result = await queryWrapper<IUser>({ query, values }, conn!);

    if (!result) {
      return undefined;
    }
    return result[0];
  }

  async create(email: string): Promise<IUser | undefined> {
    const conn = await this.mysql.getConnection();
    const query = `INSERT INTO ${USER_TABLE} (email) VALUES(?)`;
    const values = [email];

    const result = await queryWrapper<IUser>({ query, values }, conn!);

    if (!result) {
      return undefined;
    }
    return result[0];
  }
}

export default UserDAO;
