import { Request, Response } from "express";
import { FieldPacket, OkPacket, ResultSetHeader } from "mysql2/promise";
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
}

export interface IFindUserById {
  id?: string;
}

export interface IUpdateProfile {
  profile: Partial<
    Omit<IProfile, "id" | "user_id" | "created_at" | "updated_at">
  >;
}

export interface IReturnFindMyProfile
  extends Omit<IUser, "created_at" | "updated_at"> {
  profile: Omit<IProfile, "created_at" | "updated_at">;
  user_meta: Omit<IUserMeta, "created_at" | "updated_at">;
}

//

export interface IUserDAO {
  findMyProfile: (id: number) => Promise<IReturnFindMyProfile | undefined>;
  updateMyProfile: (
    id: number,
    body: IUpdateProfile
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  findOneById: (id: number) => Promise<IUser | undefined>;
  find: () => Promise<IUser[] | undefined>;
  createUserBySocial: (
    email: string
  ) => Promise<{ user: OkPacket; meta: OkPacket; profile: OkPacket }>;
  createUserByLocal: (
    data: CreateUserByLocalDto & { salt: string }
  ) => Promise<{ user: OkPacket; meta: OkPacket; profile: OkPacket }>;
}

export interface IUserService {
  findMyProfile: (id: number) => Promise<IReturnFindMyProfile | undefined>;
  updateMyProfile: (
    id: number,
    body: IUpdateProfile
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  findUserById: (id: number) => Promise<IUser | undefined>;
  findUsers: () => Promise<IUser[] | undefined>;
  findUserByEmail: (email: string) => Promise<IUser | undefined>;
  createUserBySocial: (
    email: string
  ) => Promise<{ user: OkPacket; meta: OkPacket; profile: OkPacket }>;
  createUserByLocal: (
    data: CreateUserByLocalDto
  ) => Promise<{ user: OkPacket; meta: OkPacket; profile: OkPacket }>;
}

export interface IUserController {
  createUserByLocal: (req: Request, res: Response) => Promise<Response>;
  findMyProfile: (
    req: Request,
    res: Response<{ user: IReturnFindMyProfile }>
  ) => Promise<Response>;
  updateMyProfile: (req: Request, res: Response) => Promise<Response>;
  findUserById: (req: Request, res: Response) => Promise<Response>;
  findUsers: (req: Request, res: Response) => Promise<Response>;
}
