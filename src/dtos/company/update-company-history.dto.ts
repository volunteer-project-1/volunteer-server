import { IsString, IsOptional } from "class-validator";

export class UpdateCompanyHistoryDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  history_at?: string;
}
