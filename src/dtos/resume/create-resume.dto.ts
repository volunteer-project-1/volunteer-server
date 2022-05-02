/* eslint-disable max-classes-per-file */
import {
  ValidateNested,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ArrayMinSize,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import {
  ActivityDto,
  AwardDto,
  CareerDto,
  CertificateDto,
  EducationDto,
  HelperVideoDto,
  IntroductionDto,
  MyVideoDto,
  PortfolioDto,
  PreferenceDto,
  ResumeDto,
  ResumeInfoDto,
  TrainingDto,
} from ".";
import { ICreateResume } from "../../types";

export class CreateResumeDto implements ICreateResume {
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

  //   @IsDefined()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => EducationDto)
  educations?: EducationDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CareerDto)
  careers?: CareerDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ActivityDto)
  activities?: ActivityDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => TrainingDto)
  trainings?: TrainingDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CertificateDto)
  certificates?: CertificateDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AwardDto)
  awards?: AwardDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PortfolioDto)
  portfolio?: PortfolioDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => IntroductionDto)
  introductions?: IntroductionDto[];

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MyVideoDto)
  myVideo!: MyVideoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HelperVideoDto)
  helperVideo?: HelperVideoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreferenceDto)
  preference?: PreferenceDto;

  constructor({
    resume,
    resumeInfo,
    educations,
    careers,
    activities,
    trainings,
    certificates,
    awards,
    portfolio,
    introductions,
    myVideo,
    helperVideo,
    preference,
  }: ICreateResume) {
    this.resume = resume;
    this.resumeInfo = resumeInfo;
    this.educations = educations;
    this.careers = careers;
    this.activities = activities;
    this.trainings = trainings;
    this.certificates = certificates;
    this.awards = awards;
    this.portfolio = portfolio;
    this.introductions = introductions;
    this.myVideo = myVideo;
    this.helperVideo = helperVideo;
    this.preference = preference;
  }
}
