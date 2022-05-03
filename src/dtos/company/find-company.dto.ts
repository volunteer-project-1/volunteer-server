import { Expose } from "class-transformer";
import { ICompany } from "../../types";

export class FindCompanyDto implements ICompany {
  @Expose()
  id!: number;

  @Expose()
  email!: string;

  password?: string;

  salt?: string;

  @Expose()
  created_at?: Date;

  @Expose()
  updated_at?: Date;
}
