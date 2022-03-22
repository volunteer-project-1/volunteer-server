import { Service } from "typedi";
import { OkPacket } from "mysql2/promise";
import { IFindPost, IPost, IPostDAO, IUpdatePost } from "../types";
import { findOneOrWhole, insert, MySQL, update } from "../db";
import { queryTransactionWrapper } from "../utils";
import { POSTS } from "../constants";

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

  async find({ start, limit }: { 
    start: number;
    limit: number;
  }): Promise<IPost[] |undefined> {
    const pool = this.mysql.getPool();
    // TODO 페이지네이션 나중에 추가
    const query = `
        Select id, user_id, type, title, content, view_count, created_at, updated_at 
        FROM ${POSTS} 
        WHERE id >= ? ORDER BY id LIMIT ?`;

    // const query = `Select * FROM ${USER_TABLE}`;
    const [rows] = await findOneOrWhole(
      { query, values: [start, limit] },
      pool
    )();
    if (rows.length === 0) {
      return undefined;
    }

    return rows as IPost[];
  }

  updatePost(id: number, { post }: IUpdatePost) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${POSTS}
        SET ?
        WHERE id = ?
    `;
    return update({ query, values: [post, id] }, pool)();
  }

  async findPostById(postId: number): Promise<IFindPost> {
    const pool = this.mysql.getPool();

    const query = `
      Select id, type, title, content, view_count, created_at, updated_at 
      FROM ${POSTS} 
      WHERE id = ?;
    `;
    const [rows] = await findOneOrWhole({ query, values: [postId] }, pool)();

    return rows[0] as IFindPost;
  }
}
