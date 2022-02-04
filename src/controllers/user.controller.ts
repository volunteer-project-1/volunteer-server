import { Service } from "typedi";
import { Request, Response } from "express";
import { IUserController, FindUserByIdDTO, IUser } from "../types/user";
import { UserService } from "../services";
import { BadReqError, NotFoundError } from "../utils";

@Service()
class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  findMyProfile = async ({ user }: Request, res: Response<{ user: IUser }>) => {
    const my = await this.userService.findOne(user!.id);
    if (!my) {
      throw new NotFoundError();
    }

    return res.json({ user: my }).status(200);
  };

  findById = async (
    { params: { id } }: Request<FindUserByIdDTO>,
    res: Response<{ user: IUser }>
  ) => {
    if (!id) {
      throw new NotFoundError();
    }
    const parsedInt = Number(id);

    if (!parsedInt) {
      throw new BadReqError();
    }
    const user = await this.userService.findOne(parsedInt);
    if (!user) {
      throw new NotFoundError();
    }

    return res.json({ user }).status(200);
  };

  findAll = async (_: Request, res: Response<{ users: IUser[] }>) => {
    const users = await this.userService.findAll();

    if (!users) {
      throw new NotFoundError();
    }
    return res.json({ users });
  };
}

export default UserController;
