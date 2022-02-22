import { IProfile, IUser, IUserMeta } from "../types";

export interface IUserCreateDTO {
  email: string;
  password: string;
}

export interface FindUserByIdDTO {
  id?: string;
}

export interface UpdateProfileDTO {
  name?: string;
  address?: string;
  birthday?: Date;
}

export interface ReturnFindMyProfileDTO
  extends Omit<IUser, "created_at" | "updated_at"> {
  profile: Omit<IProfile, "created_at" | "updated_at">;
  user_meta: Omit<IUserMeta, "created_at" | "updated_at">;
}
