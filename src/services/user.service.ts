/* eslint-disable no-useless-constructor */
import { Service } from "typedi";
import { IUserService, IUser } from "../types/user";
import { UserDAO } from "../daos";

@Service()
class UserService implements IUserService {
  constructor(private userDAO: UserDAO) {}

  findOne(id: number): Promise<IUser | undefined> {
    return this.userDAO.findOne(id);
  }

  findAll(): Promise<IUser[] | undefined> {
    return this.userDAO.findAll();
  }
}

export default UserService;
