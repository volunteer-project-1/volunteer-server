import { IsDateString, IsString } from "class-validator";
import { ICreateAward } from "../../types";

export class CreateAwardDto implements ICreateAward {
  @IsString()
  name!: string | null;

  @IsString()
  institute!: string | null;

  @IsDateString()
  startedAt!: Date | null;

  @IsDateString()
  finishedAt!: Date | null;
}
