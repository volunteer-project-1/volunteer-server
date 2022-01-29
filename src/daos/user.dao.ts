import { Service } from "typedi";
import { Model, model, Schema } from "mongoose";
import { IUserDAO, IUserCreateDTO, IUserDOC, IUserFilter } from "../types/user";

import { ExError } from "../utils";

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now() * 1,
  },
  updatedAt: {
    type: Number,
    default: Date.now() * 1,
  },
});

const UserModel: Model<IUserDOC> = model("User", userSchema);

@Service()
class UserDAO implements IUserDAO {
  async findOne(filter: IUserFilter, select: string) {
    return UserModel.findOne(filter).select(select).lean();
  }

  async create(data: IUserCreateDTO) {
    try {
      const createResult = await UserModel.create(data);
      return createResult;

      // catch 에서 에러는 무슨타입?
      /* eslint-disable */
    } catch (err) {
      const error = err as any;
      if (error.code) {
        throw new ExError(409, "DUPLICATE");
      }
      throw new ExError(500, "SERVER_ERROR");
    }
  }
}

export default UserDAO;
