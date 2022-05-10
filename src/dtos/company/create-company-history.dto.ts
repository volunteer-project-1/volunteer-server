import { IsString, IsNotEmpty } from "class-validator";

export class CreateCompanyHistoryDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsString()
  history_at!: string;
}
