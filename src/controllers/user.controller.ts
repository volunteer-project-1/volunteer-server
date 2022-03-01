import { Service } from "typedi";
import { Request, Response } from "express";
import { IUserController, IUser, IReturnFindMyProfile } from "../types";
import { assertNonNullish, parseToNumberOrThrow, validateDtos } from "../utils";
import { UserService } from "../services";
import { UpdateProfileDto } from "../dtos/user/update-my-profile.dto";
import { CreateUserByLocalDto } from "../dtos/user/create-user-by-local.dto";

type ReqParams = { id?: string };
@Service()
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  createUserByLocal = async (
    { body }: Request<unknown, unknown, CreateUserByLocalDto>,
    res: Response
  ) => {
    await validateDtos(new CreateUserByLocalDto(body));
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

    assertNonNullish(profile);

    return res.json({ user: profile }).status(200);
  };

  updateMyProfile = async (
    { user, body }: Request<unknown, unknown, UpdateProfileDto>,
    res: Response
  ) => {
    await validateDtos(new UpdateProfileDto(body));
    await this.userService.updateMyProfile(user!.id, body);

    return res.sendStatus(204);
  };

  findUserById = async (
    { params: { id } }: Request<ReqParams>,
    res: Response<{ user: IUser }>
  ) => {
    assertNonNullish(id);

    const user = await this.userService.findUserById(parseToNumberOrThrow(id));

    assertNonNullish(user);

    return res.json({ user }).status(200);
  };

  findUsers = async (_: Request, res: Response<{ users: IUser[] }>) => {
    const users = await this.userService.findUsers();

    assertNonNullish(users);

    return res.json({ users });
  };
}
