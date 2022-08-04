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
  educations!: EducationDto[] | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CareerDto)
  careers!: CareerDto[] | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ActivityDto)
  activities!: ActivityDto[] | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => TrainingDto)
  trainings!: TrainingDto[] | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CertificateDto)
  certificates!: CertificateDto[] | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AwardDto)
  awards!: AwardDto[] | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => PortfolioDto)
  portfolio!: PortfolioDto | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => IntroductionDto)
  introductions!: IntroductionDto[] | null;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MyVideoDto)
  myVideo!: MyVideoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HelperVideoDto)
  helperVideo!: HelperVideoDto | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => PreferenceDto)
  preference!: PreferenceDto | null;

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
    // if (activities) {

    // }
    this.trainings = trainings;
    // if (trainings) {
    // }
    this.certificates = certificates;
    // if (certificates) {
    // }
    this.awards = awards;
    // if (awards) {
    // }
    this.portfolio = portfolio;
    // if (portfolio) {
    // }
    this.introductions = introductions;
    // if (introductions) {
    // }
    this.helperVideo = helperVideo;
    // if (helperVideo) {
    // }
    this.preference = preference;
    // if (preference) {
    // }

    this.myVideo = myVideo;
  }
}
