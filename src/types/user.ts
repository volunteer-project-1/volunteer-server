import { Request, Response } from "express";
import { OkPacket } from "mysql2/promise";

export interface DefaultTime {
  createdAt: Date;
  updatedAt: Date;
}
export interface IUser extends DefaultTime {
  id: number;
  email: string;
  //   password: string;
  //   name: string;
}

const USER_TYPE = ["employee", "employer"] as const;

type UserType = typeof USER_TYPE[number];
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

export interface IUserDAO {
  findOne: (id: number) => Promise<IUser | undefined>;
  findAll: (id: string) => Promise<IUser[] | undefined>;
  create: (email: string) => Promise<OkPacket | undefined>;
}

export interface IUserService {
  findOne: (id: number) => Promise<IUser | undefined>;
  findAll: () => Promise<IUser[] | undefined>;
  create: (email: string) => Promise<OkPacket | undefined>;
}

export interface IUserController {
  findMyProfile: (
    req: Request,
    res: Response<{ user: IUser }>
  ) => Promise<Response>;
  findById: (req: Request, res: Response<{ user: IUser }>) => Promise<Response>;
  findAll: (req: Request, res: Response) => Promise<Response>;
}
