import { Request, Response } from "express";

export interface IUser {
  email: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

export interface IUserCreateDTO {
  email: string;
  password: string;
}

export interface IUserDOC extends IUser, Document {}

export interface IUserFilter {
  _id?: string;
  name?: string;
}

export interface IUserDAO {
  findOne: (filter: IUserFilter, select: string) => Promise<IUser | null>;
  create: (data: IUserCreateDTO) => Promise<IUser>;
}

export interface IUserService {
  findOne: (filter: IUserFilter, select: string) => Promise<IUser | null>;
  create: (data: IUserCreateDTO) => Promise<IUser | null>;
}

export interface IUserController {
  findById: (req: Request, res: Response) => Promise<Response>;
  create: (req: Request, res: Response) => Promise<Response>;
}
