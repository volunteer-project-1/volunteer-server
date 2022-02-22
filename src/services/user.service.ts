/* eslint-disable no-useless-constructor */
import { Service } from "typedi";
<<<<<<< HEAD
import {
  IUserService,
  IUser,
  ReturnFindMyProfileDTO,
  UpdateProfileDTO,
  IUserCreateDTO,
} from "../types/user";
import { UserDAO } from "../daos";
import { generateHashPassword } from "../utils";
=======
import { IUserService, IUser } from "../types/user";
import { UserDAO } from "../daos";
import { ReturnFindMyProfileDTO, UpdateProfileDTO } from "../dtos";
>>>>>>> 6bb777e (Config: 폴더 구조 변경)

@Service()
export class UserService implements IUserService {
  constructor(private readonly userDAO: UserDAO) {}

  findMyProfile(id: number): Promise<ReturnFindMyProfileDTO> {
    return this.userDAO.findMyProfile(id);
  }

  updateMyProfile(id: number, data: UpdateProfileDTO) {
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
