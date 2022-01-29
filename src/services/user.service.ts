/* eslint-disable no-useless-constructor */
import { Service } from "typedi";
import { IUserService, IUser } from "../types/user";
import { UserDAO } from "../daos";

@Service()
class UserService implements IUserService {
  constructor(private userDAO: UserDAO) {}

  async findOne(id: string): Promise<IUser[] | null> {
    return this.userDAO.findOne(id);
  }

  //   async create(data: IUserCreateDTO) {
  //     return this.userDAO.create(data);
  //   }
}

export default UserService;
