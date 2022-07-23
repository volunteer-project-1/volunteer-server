import { Request, Response } from "express";
import { Users, Profiles, UserMetas } from "@prisma/client";
import { DefaultTime } from ".";
import { USER_TYPE } from "../constants";
import { CreateUserByLocalDto } from "../dtos";

export interface IUserSecret {
  password?: string;
  salt?: string;
}

export interface IUser extends DefaultTime, IUserSecret {
  id: number;
  email: string;
  //   name: string;
}

export type UserType = typeof USER_TYPE[number];
export interface IUserMeta extends DefaultTime {
  id: number;
  is_verified: boolean;
  type: UserType;
  user_id: number;
}

export interface IProfile extends DefaultTime {
  id: number;
  name: string;
  address: string;
  birthday: string;
  user_id: number;
}

//
export interface ICreateUserByLocal {
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface IFindUserById {
  id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateProfile
  extends Partial<
    Omit<Profiles, "id" | "user_id" | "created_at" | "updated_at">
  > {}

export interface IReturnFindMyProfile
  extends Omit<Users, "created_at" | "updated_at"> {
  profiles: Omit<Profiles, "created_at" | "updated_at"> | null;
  userMetas: Omit<UserMetas, "created_at" | "updated_at"> | null;
}

//

export interface IUserDAO {
  findMyProfile: (
    id: number
  ) => Promise<
    (Users & { profiles: Profiles | null; userMetas: UserMetas | null }) | null
  >;
  updateMyProfile: (id: number, body: IUpdateProfile) => Promise<Profiles>;
  findOneById: (id: number) => Promise<Users | null>;
  find: ({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }) => Promise<Users[]>;
  createUserBySocial: (
    email: string
  ) => Promise<{ user: Users; userMetas: UserMetas; profiles: Profiles }>;
  createUserByLocal: (
    data: CreateUserByLocalDto & { salt: string }
  ) => Promise<{ user: Users; userMetas: UserMetas; profiles: Profiles }>;
}

export interface IUserService {
  findMyProfile: (
    id: number
  ) => Promise<
    (Users & { profiles: Profiles | null; userMetas: UserMetas | null }) | null
  >;
  updateMyProfile: (id: number, body: IUpdateProfile) => Promise<Profiles>;
  findUserById: (id: number) => Promise<Users | null>;
  findUsers: ({ id, limit }: { id: number; limit: number }) => Promise<Users[]>;
  findUserByEmail: (email: string) => Promise<Users | null>;
  createUserBySocial: (
    email: string
  ) => Promise<{ user: Users; userMetas: UserMetas; profiles: Profiles }>;
  createUserByLocal: (
    data: CreateUserByLocalDto
  ) => Promise<{ user: Users; userMetas: UserMetas; profiles: Profiles }>;
}

export interface IUserController {
  createUserByLocal: (req: Request, res: Response) => Promise<Response>;
  findMyProfile: (req: Request, res: Response) => Promise<Response>;
  updateMyProfile: (req: Request, res: Response) => Promise<Response>;
  findUserById: (req: Request, res: Response) => Promise<Response>;
  findUsers: (req: Request, res: Response) => Promise<Response>;
}
