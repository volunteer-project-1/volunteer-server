import { Service } from "typedi";
import { OkPacket } from "mysql2/promise";
import { IPostDAO } from "../types";
import { insert, MySQL } from "../db";
import { queryTransactionWrapper } from "../utils";
import { POSTS } from "../constants";
import { Console } from "console";

@Service()
export class PostDAO implements IPostDAO {
  constructor(private readonly mysql: MySQL) {}

  async createPost(userId: number, post: any) {
    const conn = await this.mysql.getConnection();

    const postField = Object.keys(post).concat("user_id");
    const postQuery = `INSERT INTO ${POSTS} (${postField}) VALUES (?)`;

    // :TODO 트렌젝션 없애야함.
    const insertPostQuery = insert(
      {
        query: postQuery,
        values: [Object.values<any>(post).concat(userId)],
      },
      conn
    );

    const results = await queryTransactionWrapper<OkPacket>(
      [insertPostQuery],
      conn
    );

    return { post: results![0][0] };
  }
}
