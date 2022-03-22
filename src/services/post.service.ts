import { Service } from "typedi";
import { PostDAO } from "../daos";
import { UpdatePostDto } from "../dtos";
import { IPostService } from "../types";

@Service()
export class PostService implements IPostService {
  constructor(private postDAO: PostDAO) {}

  findPostById(id: number) {
    return this.postDAO.findPostById(id);
  }

  createPost(userId: number, data: any) {
    return this.postDAO.createPost(userId, data);
  }

  find(data: {start: number, limit: number}) {
    return this.postDAO.find(data);
  }

  updatePost(id: number, data: UpdatePostDto) {
    return this.postDAO.updatePost(id, data);
  }
}
