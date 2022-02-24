/* eslint-disable max-classes-per-file */
import {
  ValidateNested,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";
import {
  ActivityDto,
  AwardDto,
  CareerDto,
  EducationDto,
  HelperVideoDto,
  MyVideoDto,
  PreferenceDto,
  ResumeDto,
  ResumeInfoDto,
} from ".";
import { ICreateResume } from "../../types";

export class CreateResumeDto {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ResumeDto)
  resume!: ResumeDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ResumeInfoDto)
  resumeInfo!: ResumeInfoDto;

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => EducationDto)
  educations!: EducationDto[];

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CareerDto)
  careers!: CareerDto[];

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ActivityDto)
  activities!: ActivityDto[];

  @IsDefined()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AwardDto)
  awards!: AwardDto[];

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MyVideoDto)
  myVideo!: MyVideoDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => HelperVideoDto)
  helperVideo!: HelperVideoDto;

  @ValidateNested()
  @Type(() => PreferenceDto)
  preference!: PreferenceDto;

  constructor({
    resume,
    resumeInfo,
    educations,
    careers,
    activities,
    awards,
    myVideo,
    helperVideo,
    preference,
  }: ICreateResume) {
    this.resume = resume;
    this.resumeInfo = resumeInfo;
    this.educations = educations;
    this.careers = careers;
    this.activities = activities;
    this.awards = awards;
    this.myVideo = myVideo;
    this.helperVideo = helperVideo;
    this.preference = preference;
  }
}
