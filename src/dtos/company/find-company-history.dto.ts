import { Expose } from "class-transformer";
import { ICompanyHistory } from "../../types";

export class FindCompanyHistoryDto implements ICompanyHistory {
  @Expose()
  id!: number;

  @Expose()
  content!: string;

  @Expose()
  history_at!: string;

  @Expose()
  user_id!: string;
}
