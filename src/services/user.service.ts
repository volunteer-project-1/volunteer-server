/* eslint-disable no-useless-constructor */
import { Service } from "typedi";
import {
  IUserService,
  IUser,
  IReturnFindMyProfile,
  IUpdateProfile,
} from "../types/user";
import { UserDAO } from "../daos";
import { generateHashPassword } from "../utils/hashing-password";
import { CreateUserByLocalDto } from "../dtos";

@Service()
export class UserService implements IUserService {
  constructor(private readonly userDAO: UserDAO) {}

  findMyProfile(id: number): Promise<IReturnFindMyProfile> {
    return this.userDAO.findMyProfile(id);
  }

  updateMyProfile(id: number, data: IUpdateProfile) {
    return this.userDAO.updateMyProfile(id, data);
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

  createUserBySocial(email: string) {
    return this.userDAO.createUserBySocial(email);
  }

  async createUserByLocal({ email, password }: CreateUserByLocalDto) {
    const { hash: hasedPassword, salt } = await generateHashPassword(password);

    const input: CreateUserByLocalDto & { salt: string } = {
      email,
      password: hasedPassword,
      salt,
    };

    return this.userDAO.createUserByLocal(input);
  }
}
