import { Service } from "typedi";
import { Request, Response } from "express";
import { Users } from "@prisma/client";
import { IUserController, IReturnFindMyProfile } from "../types";
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
    const { user, userMetas, profiles } =
      await this.userService.createUserByLocal(body);

    return res.json({ user, userMetas, profiles });
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
    console.log("body :", body);
    await validateDtos(new UpdateProfileDto(body));
    await this.userService.updateMyProfile(user!.id, body);

    return res.sendStatus(204);
  };

  findUserById = async (
    { params: { id } }: Request<ReqParams>,
    res: Response<{ user: Users }>
  ) => {
    assertNonNullish(id);

    const user = await this.userService.findUserById(parseToNumberOrThrow(id));

    assertNonNullish(user);

    return res.json({ user }).status(200);
  };

  findUsers = async (
    {
      query: { id, limit },
    }: Request<unknown, unknown, unknown, { id?: string; limit?: string }>,
    res: Response<{ users: Users[] }>
  ) => {
    assertNonNullish(id);
    assertNonNullish(limit);

    const users = await this.userService.findUsers({
      id: parseToNumberOrThrow(id),
      limit: parseToNumberOrThrow(limit),
    });

    assertNonNullish(users);

    return res.json({ users });
  };
}
