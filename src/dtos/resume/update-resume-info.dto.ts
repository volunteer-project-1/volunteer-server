import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { ResumeInfoDto } from ".";
import { IUpdateResumeInfo } from "../../types";

export class UpdateResumeInfoDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ResumeInfoDto)
  resumeInfo!: Partial<ResumeInfoDto>;

  constructor({ resumeInfo }: IUpdateResumeInfo) {
    this.resumeInfo = resumeInfo;
  }
}
