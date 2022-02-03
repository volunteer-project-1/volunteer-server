import { Request, Response } from "express";

export interface DefaultTime {
  createdAt: number;
  updatedAt: number;
}
export interface IUser extends DefaultTime {
  email: string;
  password: string;
  name: string;
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
  create: (email: string) => Promise<IUser | undefined>;
}

export interface IUserService {
  findOne: (id: number) => Promise<IUser | undefined>;
  findAll: () => Promise<IUser[] | undefined>;
  create: (email: string) => Promise<IUser | undefined>;
}

export interface IUserController {
  findById: (req: Request, res: Response<{ user: IUser }>) => Promise<Response>;
  findAll: (req: Request, res: Response) => Promise<Response>;
}
