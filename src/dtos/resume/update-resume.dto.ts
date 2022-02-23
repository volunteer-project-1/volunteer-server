import { Type } from "class-transformer";
import { ValidateNested, IsNotEmptyObject } from "class-validator";
import { ResumeDto } from ".";
import { IUpdateResume } from "../../types";

export class UpdateResumeDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ResumeDto)
  resume!: Partial<ResumeDto>;

  //   constructor({ resume }: { resume: Partial<ResumeDto> }) {
  constructor({ resume }: IUpdateResume) {
    this.resume = resume;
  }
}
