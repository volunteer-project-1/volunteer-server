import { Service } from "typedi";
import { PostDAO } from "../daos";
import { IPostService } from "../types";

@Service()
export class PostService implements IPostService {
  constructor(private postDAO: PostDAO) {}

  createPost(userId: number, data: any) {
    return this.postDAO.createPost(userId, data);
  }
}
