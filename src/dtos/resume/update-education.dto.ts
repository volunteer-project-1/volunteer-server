import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { EducationDto } from ".";
import { IUpdateEducation } from "../../types";

export class UpdateEducationDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => EducationDto)
  education!: Partial<EducationDto>;

  constructor({ education }: IUpdateEducation) {
    this.education = education;
  }
}
