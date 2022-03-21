import { Service } from "typedi";
import { Request, Response } from "express";
import { IPostController } from "../types";
import { PostService } from "../services";
import { validateDto } from "../utils";
import { CreatePostDto } from "../dtos";

@Service()
export class PostController implements IPostController {
  constructor(private readonly postService: PostService) {}

  // :TODO 몇몇 유저만 입력가능하도록 미들웨어 추가
  createPost = async ({ body, user }: Request, res: Response) => {
    await validateDto(new CreatePostDto(body));

    await this.postService.createPost(user!.id, body);

    return res.sendStatus(201);
  };

  find = async (req: Request, res: Response) => {
    const { start, limit } = req.query;
    
    const posts = await this.postService.find({start: Number(start), limit: Number(limit)});

    return res.json({ posts: posts}).status(200);
  }
}
