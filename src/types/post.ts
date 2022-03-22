import { Request, Response } from "express";
import { FieldPacket, OkPacket, ResultSetHeader } from "mysql2/promise";
import { DefaultTime } from ".";
import { UpdatePostDto } from "../dtos";

// 기본 타입
export interface IPost extends DefaultTime {
  id: number;
  user_id: number;
  seq: number;
  type: string;
  title: string;
  content: string;
  view_count: number;
}

export interface ICreatePost {
  user_id: number;
  type: string;
  title: string;
  content: string;
}

export interface IUpdatePost {
  post: Partial<Omit<IPost, "id" | "user_id">>;
}

export interface IPostDAO {
  createPost: (userId: number, data: any) => Promise<{ post: OkPacket }>;
  find: ({ start, limit }: {
    start: number;
    limit: number;
  }) => Promise<IPost[] | undefined>;
  updatePost: (
    id: number,
    data: UpdatePostDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
}

export interface IPostService {
  createPost: (userId: number, data: any) => Promise<{ post: OkPacket }>;
  find: (data: {
    start: number;
    limit: number;
  }) =>  Promise<IPost[] | undefined>;
  updatePost: (
    resumeId: number,
    data: UpdatePostDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
}

export interface IPostController {
  createPost: (req: Request, res: Response) => Promise<Response>;
  find: (req: Request, res: Response) => Promise<Response>;
  updatePostById: (req: Request, res: Response) => Promise<Response>;
}
