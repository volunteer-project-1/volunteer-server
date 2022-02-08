import { Request, Response } from "express";
import { DefaultTime } from ".";

export interface IUser extends DefaultTime {
  id: number;
  email: string;
  //   password: string;
  //   name: string;
}

const USER_TYPE = ["employee", "employer"] as const;

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
  birthday: Date;
  user_id: number;
}

export interface IUserCreateDTO {
  email: string;
  password: string;
}

export interface FindUserByIdDTO {
  id?: string;
}

export interface UpdateProfileDTO {
  name?: string;
  address?: string;
  birthday?: Date;
}

export interface ReturnFindMyProfileDTO
  extends Omit<IUser, "created_at" | "updated_at"> {
  user_meta_id: string;
  is_verified: boolean;
  type: UserType;
  name: string;
  address: string;
  birthday: Date;
}

export interface IUserDAO {
  findMyProfile: (id: number) => Promise<ReturnFindMyProfileDTO | undefined>;
  updateMyProfile: (id: number, body: UpdateProfileDTO) => Promise<void>;
  findOneById: (id: number) => Promise<IUser | undefined>;
  find: () => Promise<IUser[] | undefined>;
  create: (email: string) => Promise<void>;
}

export interface IUserService {
  findMyProfile: (id: number) => Promise<ReturnFindMyProfileDTO | undefined>;
  updateMyProfile: (id: number, body: UpdateProfileDTO) => Promise<void>;
  findUserById: (id: number) => Promise<IUser | undefined>;
  findUsers: () => Promise<IUser[] | undefined>;
  findUserByEmail: (email: string) => Promise<IUser | undefined>;
  createUser: (email: string) => Promise<void>;
}

export interface IUserController {
  findMyProfile: (
    req: Request,
    res: Response<{ user: ReturnFindMyProfileDTO }>
  ) => Promise<Response>;
  updateMyProfile: (req: Request, res: Response) => Promise<Response>;
  findUserById: (
    req: Request,
    res: Response<{ user: IUser }>
  ) => Promise<Response>;
  findUsers: (req: Request, res: Response) => Promise<Response>;
}
