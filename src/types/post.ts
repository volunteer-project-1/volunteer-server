import { Request, Response } from "express";
import { OkPacket } from "mysql2/promise";
import { DefaultTime } from ".";

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

export interface IPostDAO {
  createPost: (userId: number, data: any) => Promise<{ post: OkPacket }>;
  find: ({ start, limit }: {
    start: number;
    limit: number;
  }) => Promise<IPost[] | undefined>
}

export interface IPostService {
  createPost: (userId: number, data: any) => Promise<{ post: OkPacket }>;
  find: (data: {
    start: number;
    limit: number;
  }) =>  Promise<IPost[] | undefined>
}

export interface IPostController {
  createPost: (req: Request, res: Response) => Promise<Response>;
  find: (req: Request, res: Response) => Promise<Response>;
}
