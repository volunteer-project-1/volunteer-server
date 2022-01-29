import { Service } from "typedi";
import {
  IUserDAO,
  //   IUserCreateDTO,
  //   IUserDOC,
  //   IUserFilter,
  IUser,
} from "../types/user";
import { MySQL } from "../utils";

@Service()
class UserDAO implements IUserDAO {
  constructor(private readonly mysql: MySQL) {}

  async findOne(id: string) {
    const [rows, _] = await this.mysql.getPool(
      `SELECT * FROM Users WHERE id=?`,
      { id }
    );
    return rows as IUser[];
    // return UserModel.findOne(filter).select(select).lean();
  }

  //   async create(data: IUserCreateDTO) {
  //     try {
  //       const [rows, _] = await this.mysql.getPool(
  //         `INSERT INTO User() VALUES ()`
  //       );
  //       return rows;

  //       // catch 에서 에러는 무슨타입?
  //       /* eslint-disable */
  //     } catch (err) {
  //       const error = err as any;
  //       if (error.code) {
  //         throw new ExError(409, "DUPLICATE");
  //       }
  //       throw new ExError(500, "SERVER_ERROR");
  //     }
  //   }
}

export default UserDAO;
