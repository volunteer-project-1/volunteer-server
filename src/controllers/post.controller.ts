import { Service } from "typedi";
import { Request, Response } from "express";
import { IPostController } from "../types";
import { PostService } from "../services";
import { BadReqError, NotFoundError, validateDto } from "../utils";
import { CreatePostDto, UpdatePostDto } from "../dtos";

type ReqParams = {
  id?: string;
};

@Service()
export class PostController implements IPostController {
  constructor(private readonly postService: PostService) {}

  findPostById = async (
    { params: { id } }: Request<ReqParams>,
    res: Response
  ) => {
    const parsedInt = Number(id);

    if (!id || !parsedInt) {
      throw new BadReqError();
    }

    const post = await this.postService.findPostById(parsedInt);
    if (!post) {
      throw new NotFoundError();
    }

    return res.json({ post });
  };

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
  };

  updatePostById = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdatePostDto>,
    res: Response
  ) => {
    const parsedInt = Number(id);
    if (!id || !parsedInt) {
      throw new BadReqError();
    }

    await validateDto(new UpdatePostDto(body));

    const [result] = await this.postService.updatePost(parsedInt, body);
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }

    return res.sendStatus(204);
  };

  deletePost = async (
    { params: { id } }: Request<ReqParams>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }
    const [{ affectedRows }] = await this.postService.deletePost(parsedId);

    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };
}
