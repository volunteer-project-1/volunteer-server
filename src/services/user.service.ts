/* eslint-disable no-useless-constructor */
import { Service } from "typedi";
import {
  IUserService,
  IUser,
  ReturnFindMyProfileDTO,
  UpdateProfileDTO,
  IUserCreateDTO,
} from "../types/user";
import { UserDAO } from "../daos";
import { generateHashPassword } from "../utils";

@Service()
export class UserService implements IUserService {
  constructor(private userDAO: UserDAO) {}

  findMyProfile(id: number): Promise<ReturnFindMyProfileDTO> {
    return this.userDAO.findMyProfile(id);
  }

  updateMyProfile(id: number, body: UpdateProfileDTO) {
    return this.userDAO.updateMyProfile(id, body);
  }

  findUserById(id: number): Promise<IUser | undefined> {
    return this.userDAO.findOneById(id);
  }

  findUsers(): Promise<IUser[] | undefined> {
    return this.userDAO.find();
  }

  findUserByEmail(email: string) {
    return this.userDAO.findByEmail(email);
  }

  createUser(email: string) {
    return this.userDAO.create(email);
  }

  async createUserLocal(email: string, password: string) {
    const saltAndHash = await generateHashPassword(password);

    const input: IUserCreateDTO = {
      email,
      password: saltAndHash.hash,
      salt: saltAndHash.salt,
    };

    return this.userDAO.createLocal(input);
  }
}
