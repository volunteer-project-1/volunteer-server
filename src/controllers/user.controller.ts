import { Service } from "typedi";
import { Request, Response } from "express";
import { IUserController, FindUserByIdDTO, IUser } from "../types/user";
import { UserService } from "../services";
import { BadReqError, NotFoundError } from "../utils";

@Service()
class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  findById = async (
    { params: { id } }: Request<FindUserByIdDTO>,
    res: Response<{ user: IUser }>
    // eslint-disable-next-line consistent-return
  ) => {
    if (!id) {
      throw new NotFoundError();
    }
    const parsedInt = Number(id);
    if (!parsedInt) {
      throw new BadReqError();
    }
    const user = await this.userService.findOne(parsedInt);
    if (!user || user.length < 1) {
      throw new NotFoundError();
    }

    return res.json({ user: user[0] }).status(200);
  };

  findAll = async (_: Request, res: Response<{ users: IUser[] }>) => {
    const users = await this.userService.findAll();

    if (!users || users.length < 1) {
      throw new NotFoundError();
    }
    return res.json({ users });
  };
}

export default UserController;
