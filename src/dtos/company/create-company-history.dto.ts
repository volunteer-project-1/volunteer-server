import { IsString, IsNotEmpty, IsDateString } from "class-validator";

export class CreateCompanyHistoryDto {
  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsDateString()
  historyAt!: Date;
}
