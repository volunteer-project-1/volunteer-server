import { Service } from "typedi";
import { Request, Response } from "express";
import { IUserController, IUser, IReturnFindMyProfile } from "../types";
import { BadReqError, NotFoundError, validateDto } from "../utils";
import { UserService } from "../services";
import { UpdateProfileDto } from "../dtos/user/update-my-profile.dto";
import { CreateUserByLocalDto } from "../dtos/user/create-user-by-local.dto";

@Service()
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  createUserByLocal = async (
    { body }: Request<unknown, unknown, CreateUserByLocalDto>,
    res: Response
  ) => {
    await validateDto(new CreateUserByLocalDto(body));
    await this.userService.createUserByLocal(body);

    return res.sendStatus(201);
  };

  findMyProfile = async (
    { user }: Request,
    res: Response<{
      user: IReturnFindMyProfile;
    }>
  ) => {
    const profile = await this.userService.findMyProfile(user!.id);
    if (!profile) {
      throw new NotFoundError();
    }

    return res.json({ user: profile }).status(200);
  };

  updateMyProfile = async (
    { user, body }: Request<unknown, unknown, UpdateProfileDto>,
    res: Response
  ) => {
    await validateDto(new UpdateProfileDto(body));
    await this.userService.updateMyProfile(user!.id, body);

    return res.sendStatus(204);
  };

  findUserById = async (
    { params: { id } }: Request,
    res: Response<{ user: IUser }>
  ) => {
    if (!id) {
      throw new NotFoundError();
    }
    const parsedInt = Number(id);

    if (!parsedInt) {
      throw new BadReqError();
    }
    const user = await this.userService.findUserById(parsedInt);
    if (!user) {
      throw new NotFoundError();
    }

    return res.json({ user }).status(200);
  };

  findUsers = async (_: Request, res: Response<{ users: IUser[] }>) => {
    const users = await this.userService.findUsers();

    if (!users) {
      throw new NotFoundError();
    }
    return res.json({ users });
  };
}
