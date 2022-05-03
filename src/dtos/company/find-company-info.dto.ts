import { Expose } from "class-transformer";
import { ICompanyInfo } from "../../types";

export class FindCompanyInfoDto implements ICompanyInfo {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  introduce!: string;

  @Expose()
  founded_at!: string;

  @Expose()
  member!: number;

  @Expose()
  acc_investment!: number;

  @Expose()
  homepage!: string;

  @Expose()
  email!: string;

  @Expose()
  phone_number!: string;

  @Expose()
  address!: string;

  @Expose()
  industry_type!: string;

  @Expose()
  user_id!: string;
}
