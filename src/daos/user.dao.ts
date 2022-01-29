import { Service } from "typedi";
import { IUserDAO, IUser } from "../types/user";
import { MySQL, queryWrapper } from "../utils";

@Service()
class UserDAO implements IUserDAO {
  constructor(private readonly mysql: MySQL) {}

  async findOne(id: number): Promise<IUser[] | undefined> {
    const conn = await this.mysql.getConnection();
    const query = "Select * FROM users WHERE id=?";
    const values = [String(id)];

    return queryWrapper<IUser[]>({ query, values }, conn!);
  }

  async findAll(): Promise<IUser[] | undefined> {
    const conn = await this.mysql.getConnection();
    const query = "Select * FROM users";
    return queryWrapper<IUser[]>({ query }, conn!);
  }
}

export default UserDAO;
