import { Service } from "typedi";
import {
  IUserDAO,
  IUser,
  ReturnFindMyProfileDTO,
  UpdateProfileDTO,
} from "../types/user";
import { find, findOne, insert, update } from "../utils";

const USER_TABLE = "users";
const USER_METAS_TABLE = "user_metas";
const USER_PROFILE = "profiles";

@Service()
class UserDAO implements IUserDAO {
  async findMyProfile(id: number): Promise<ReturnFindMyProfileDTO | undefined> {
    const query = `
    Select 
        U.id, U.email, 
        M.id AS user_meta_id, M.is_verified, M.type, 
        P.name, P.address, P.birthday
    FROM ${USER_TABLE} AS U 
    LEFT JOIN ${USER_METAS_TABLE} AS M 
        ON U.id = M.user_id 
    LEFT JOIN ${USER_PROFILE} AS P 
        ON U.id = P.user_id 
    WHERE U.id = ?`;

    const result = await findOne<ReturnFindMyProfileDTO>({
      query,
      values: [id],
    });

    if (!result) {
      return undefined;
    }
    return result;
  }

  async updateMyProfile(id: number, body: UpdateProfileDTO) {
    const query = `
        UPDATE ${USER_PROFILE} 
        SET ?
        WHERE user_id=?
    `;

    return update({
      query,
      values: [body, id],
    });
  }

  async findOneById(id: number): Promise<IUser | undefined> {
    const query = `Select * FROM ${USER_TABLE} WHERE id=?`;
    const result = await findOne<IUser>({ query, values: [id] });

    if (!result) {
      return undefined;
    }
    return result;
  }

  async find(): Promise<IUser[] | undefined> {
    const query = `Select * FROM ${USER_TABLE}`;
    return find<IUser[]>({ query });
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const query = `Select * FROM ${USER_TABLE} WHERE email=?`;

    const result = await findOne<IUser>({ query, values: [email] });

    if (!result) {
      return undefined;
    }
    return result;
  }

  async create(email: string) {
    const userQuery = `
        INSERT INTO ${USER_TABLE} (email) VALUES(?);
        `;

    const user = await insert({ query: userQuery, values: [email] });

    const userMetaQuery = `
        INSERT INTO ${USER_METAS_TABLE} (user_id) VALUES (?);
        `;

    await insert({ query: userMetaQuery, values: [user!.insertId] });

    return user!;
  }
}

export default UserDAO;
