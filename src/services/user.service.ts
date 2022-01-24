import { Service } from "typedi";
import { IUserService, IUserCreateDTO, IUserFilter } from "../types/user";
import { UserDAO } from "../daos";

@Service()
class UserService implements IUserService {
  constructor(private userDAO: UserDAO) {}

  async findOne(filter: IUserFilter, select: string) {
    return this.userDAO.findOne(filter, select);
  }

  async create(data: IUserCreateDTO) {
    return this.userDAO.create(data);
  }
}

export default UserService;
