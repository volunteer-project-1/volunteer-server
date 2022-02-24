import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { CareerDto } from ".";
import { IUpdateCareer } from "../../types";

export class UpdateCareerDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CareerDto)
  career!: Partial<CareerDto>;

  constructor({ career }: IUpdateCareer) {
    this.career = career;
  }
}
