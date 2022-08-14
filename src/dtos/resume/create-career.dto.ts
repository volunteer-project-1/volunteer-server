import { IsBoolean, IsDateString, IsString } from "class-validator";
import { ICreateCareer } from "../../types";

export class CreateCareerDto implements ICreateCareer {
  @IsString()
  company!: string | null;

  @IsString()
  department!: string | null;

  @IsString()
  position!: string | null;

  @IsString()
  task!: string | null;

  @IsDateString()
  joinedAt!: Date | null;

  @IsDateString()
  quitedAt!: Date | null;

  @IsBoolean()
  isInOffice!: boolean | null;
}
