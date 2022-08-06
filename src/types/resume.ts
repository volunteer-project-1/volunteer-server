import {
  Activities,
  Awards,
  Careers,
  Certificates,
  Educations,
  HelperVideos,
  Introductions,
  MyVideos,
  Portfolios,
  PreferenceJobs,
  PreferenceLocations,
  Preferences,
  ResumeInfos,
  Resumes,
  Trainings,
} from "@prisma/client";
import { Request, Response } from "express";
import { DefaultTime } from ".";
import { DISABLILITY_LEVEL, DISABLILITY_TYPE } from "../constants";
import {
  CreateResumeDto,
  UpdateResumeDto,
  UpdateAwardDto,
  UpdateCareerDto,
  UpdateEducationDto,
  UpdateHelperVideoDto,
  UpdateMyVideoDto,
  UpdatePreferenceDto,
  UpdatePreferenceJobDto,
  UpdatePreferenceLocationDto,
  UpdateResumeInfoDto,
  UpdateActivityDto,
} from "../dtos";

export type DisabilityLevel = typeof DISABLILITY_LEVEL[number];
export type DisabilityType = typeof DISABLILITY_TYPE[number];
export type Sex = "남" | "여";

// 기본 타입
export interface IResume extends DefaultTime {
  id: number;
  title: string;
  content: string;
  isPublic: boolean;
  userId: number;
}

export interface IResumeInfo {
  id: number;
  resumeId: number;
  name: string;
  birthday: Date;
  phoneNumber: string;
  email: string;
  sido: string;
  sigungu: string;
  disabilityLevel?: DisabilityLevel;
  disabilityType?: DisabilityType;
  sex: Sex;
  avatar?: string;
}

export interface IEducation {
  id: number;
  resume_id: number;
  type: string;
  school_name: string;
  graduation_year: Date;
  admission_year: Date;
  is_graduated: boolean;
  major: string;
  credit: number;
  total_credit: number;
}
export interface ICareers {
  id: number;
  resume_id: number;
  company: string;
  department: string;
  position: string;
  task: string;
  joined_at: string;
}

export interface IActivity {
  id: number;
  resume_id: number;
  organization: string;
  description: string;
}
// TODO 교육이수, 자격증, 포트폴리오, 자기소개서

// 교육이수
export interface ITraining {
  id: number;
  name: string;
  institute: string;
  content: string;
  resume_id: number;
  started_at: string;
  finished_at: string;
}

export interface ICertificate {
  id: number;
  resume_id: number;
  name: string;
  institute: string;
  acquisition_at: string;
}
// 수상경력
export interface IAward {
  id: number;
  resume_id: number;
  institute: string;
  started_at: string;
  finished_at: string;
}

export interface IPortfolio {
  id: number;
  resume_id: number;
  url: string;
}
export interface IIntroduction {
  id: number;
  resume_id: number;
  title: string;
  content: string;
}

export interface IMyVideo {
  id: number;
  resume_id: number;
  url: string;
}

export interface IHelperVideo {
  id: number;
  resume_id: number;
  url: string;
}

export interface IPreference {
  id: number;
  resume_id: number;
  employ_type: number;
  salary: number;
}

export interface IPreferenceLocation {
  id: number;
  preference_id: number;
  sido: string;
  sigungu: string;
}

export interface IPreferenceJob {
  id: number;
  preference_id: number;
  name: string;
}

// dto 타입

export interface ICreateResume {
  resume: Omit<Resumes, "id" | "userId" | "createdAt" | "updatedAt">;
  resumeInfo: Omit<ResumeInfos, "id" | "resumeId">;
  educations: Omit<Educations, "id" | "resumeId">[] | null;
  careers: Omit<Careers, "id" | "resumeId">[] | null;
  activities: Omit<Activities, "id" | "resumeId">[] | null;
  trainings: Omit<Trainings, "id" | "resumeId">[] | null;
  certificates: Omit<Certificates, "id" | "resumeId">[] | null;
  awards: Omit<Awards, "id" | "resumeId">[] | null;
  portfolio: Omit<Portfolios, "id" | "resumeId"> | null;
  introductions: Omit<Introductions, "id" | "resumeId">[] | null;
  myVideo: Omit<MyVideos, "id" | "resumeId">;
  helperVideo: Omit<HelperVideos, "id" | "resumeId"> | null;
  preference:
    | (Omit<Preferences, "id" | "resumeId"> & {
        preferenceLocations:
          | Omit<PreferenceLocations, "id" | "preferenceId">[]
          | null;
        preferenceJobs: Omit<PreferenceJobs, "id" | "preferenceId">[] | null;
      })
    | null;
}

export interface IUpdateResume {
  resume: Partial<Omit<Resumes, "id" | "userId">>;
}
export interface IUpdateResumeInfo {
  resumeInfo: Partial<Omit<ResumeInfos, "id" | "resumeId">>;
}
export interface IUpdateEducation {
  education: Partial<Omit<Educations, "id" | "resumeId">>;
}

export type ICreateEducation = Omit<Educations, "id" | "resumeId">;
export type ICreateCareer = Omit<Careers, "id" | "resumeId">;
export type ICreateActivity = Omit<Activities, "id" | "resumeId">;
export type ICreateAward = Omit<Awards, "id" | "resumeId">;

export interface IUpdateCareer {
  career: Partial<Omit<Careers, "id" | "resumeId">>;
}
export interface IUpdateActivity {
  activity: Partial<Omit<Activities, "id" | "resumeId">>;
}
export interface IUpdateAward {
  award: Partial<Omit<Awards, "id" | "resumeId">>;
}
export interface IUpdateMyVideo {
  myVideo: Partial<Omit<MyVideos, "id" | "resumeId">>;
}
export interface IUpdateHelperVideo {
  helperVideo: Partial<Omit<HelperVideos, "id" | "resumeId">>;
}

export interface IUpdatePreference {
  preference: Partial<Omit<Preferences, "id" | "resumeId">>;
}
export interface IUpdatePreferenceJob {
  preferenceJob: Partial<Omit<PreferenceJobs, "id" | "preferenceId">>;
}
export interface IUpdatePreferenceLocation {
  preferenceLocation: Partial<Omit<PreferenceLocations, "id" | "preferenceId">>;
}

export type IFindResume = Omit<IResume, "user_id">;

export interface IFindWholeResume extends Omit<IResume, "user_id"> {
  resume_info: IResumeInfo;
  educations: IEducation[];
  careers: ICareers[];
  certificates: ICertificate[];
  activities: IActivity[];
  awards: IAward[];
  trainings: ITraining[];
  introductions: IIntroduction[];
  portfolio: IPortfolio;
  myVidoe: IMyVideo;
  helperVideo: IHelperVideo;
  preference: IPreference & {
    preferenceJobs: IPreferenceJob[];
    preferenceLocations: IPreferenceLocation[];
  };
}

// dao

export interface IResumeDAO {
  createResume: (
    userId: number,
    data: CreateResumeDto
  ) => Promise<{
    resume: Resumes;
    resumeInfo: ResumeInfos;
    educations: Educations[] | null;
    careers: Careers[] | null;
    activities: Activities[] | null;
    trainings: Trainings[] | null;
    certificates: Certificates[] | null;
    awards: Awards[] | null;
    portfolio: Portfolios | null;
    introductions: Introductions[] | null;
    myVideo: MyVideos;
    helperVideo: HelperVideos | null;
    preference:
      | (Preferences & {
          preferenceJobs: PreferenceJobs[] | null;
          preferenceLocations: PreferenceLocations[] | null;
        })
      | null;
  }>;
  findPublicResumes: ({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }) => Promise<Resumes[]>;
  findMyResumes: (id: number) => Promise<Resumes[]>;
  findResumeById: (id: number) => Promise<
    | (Resumes & {
        careers: Careers[];
        resumeInfos: ResumeInfos | null;
        educations: Educations[];
        activities: Activities[];
        awards: Awards[];
        certificates: Certificates[];
        introductions: Introductions[];
        portfolios: Portfolios[];
        trainings: Trainings[];
        helperVideos: HelperVideos | null;
        myVideos: MyVideos | null;
        preferences: (Preferences & {
          preferenceJobs: PreferenceJobs[];
          preferenceLocation: PreferenceLocations[];
        })[];
      })
    | null
  >;
  updateResume: (id: number, data: UpdateResumeDto) => Promise<Resumes>;
  deleteResume: (id: number) => Promise<Resumes>;

  updateResumeInfo: (
    id: number,
    data: UpdateResumeInfoDto
  ) => Promise<ResumeInfos>;
  deleteResumeInfo: (id: number) => Promise<ResumeInfos>;

  updateEducation: (
    id: number,
    data: UpdateEducationDto
  ) => Promise<Educations>;
  deleteEducation: (id: number) => Promise<Educations>;

  updateCareer: (id: number, data: UpdateCareerDto) => Promise<Careers>;
  deleteCareer: (id: number) => Promise<Careers>;

  updateActivity: (id: number, data: UpdateActivityDto) => Promise<Activities>;
  deleteActivity: (id: number) => Promise<Activities>;

  updateAward: (id: number, data: UpdateAwardDto) => Promise<Awards>;
  deleteAward: (id: number) => Promise<Awards>;

  updateMyVideo: (id: number, data: UpdateMyVideoDto) => Promise<MyVideos>;
  deleteMyVideo: (id: number) => Promise<MyVideos>;

  updateHelperVideo: (
    id: number,
    data: UpdateHelperVideoDto
  ) => Promise<HelperVideos>;
  deleteHelperVideo: (id: number) => Promise<HelperVideos>;

  updatePreference: (
    id: number,
    data: UpdatePreferenceDto
  ) => Promise<Preferences>;
  deletePreference: (id: number) => Promise<Preferences>;

  updatePreferenceJob: (
    id: number,
    data: UpdatePreferenceJobDto
  ) => Promise<PreferenceJobs>;
  deletePreferenceJob: (id: number) => Promise<PreferenceJobs>;

  updatePreferenceLocation: (
    id: number,
    data: UpdatePreferenceLocationDto
  ) => Promise<PreferenceLocations>;
  deletePreferenceLocation: (id: number) => Promise<PreferenceLocations>;
}

export interface IResumeService {
  createResume: (
    id: number,
    data: CreateResumeDto
  ) => Promise<{
    resume: Resumes;
    resumeInfo: ResumeInfos;
    educations: Educations[] | null;
    careers: Careers[] | null;
    activities: Activities[] | null;
    trainings: Trainings[] | null;
    certificates: Certificates[] | null;
    awards: Awards[] | null;
    portfolio: Portfolios | null;
    introductions: Introductions[] | null;
    myVideo: MyVideos;
    helperVideo: HelperVideos | null;
    preference:
      | (Preferences & {
          preferenceJobs: PreferenceJobs[] | null;
          preferenceLocations: PreferenceLocations[] | null;
        })
      | null;
  }>;
  findPublicResumes: ({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }) => Promise<Resumes[]>;
  findMyResumes: (id: number) => Promise<Resumes[]>;
  findResumeById: (resumeId: number) => Promise<
    | (Resumes & {
        careers: Careers[];
        resumeInfos: ResumeInfos | null;
        educations: Educations[];
        activities: Activities[];
        awards: Awards[];
        certificates: Certificates[];
        introductions: Introductions[];
        portfolios: Portfolios[];
        trainings: Trainings[];
        helperVideos: HelperVideos | null;
        myVideos: MyVideos | null;
        preferences: (Preferences & {
          preferenceJobs: PreferenceJobs[];
          preferenceLocation: PreferenceLocations[];
        })[];
      })
    | null
  >;
  updateResume: (resumeId: number, data: UpdateResumeDto) => Promise<Resumes>;
  deleteResume: (resumeId: number) => Promise<Resumes>;

  updateResumeInfo: (
    id: number,
    data: UpdateResumeInfoDto
  ) => Promise<ResumeInfos>;
  deleteResumeInfo: (id: number) => Promise<ResumeInfos>;

  updateEducation: (
    id: number,
    data: UpdateEducationDto
  ) => Promise<Educations>;
  deleteEducation: (id: number) => Promise<Educations>;

  updateCareer: (id: number, data: UpdateCareerDto) => Promise<Careers>;
  deleteCareer: (id: number) => Promise<Careers>;

  updateActivity: (id: number, data: UpdateActivityDto) => Promise<Activities>;
  deleteActivity: (id: number) => Promise<Activities>;

  updateAward: (id: number, data: UpdateAwardDto) => Promise<Awards>;
  deleteAward: (id: number) => Promise<Awards>;

  updateMyVideo: (Awardsd: number, data: UpdateMyVideoDto) => Promise<MyVideos>;
  deleteMyVideo: (id: number) => Promise<MyVideos>;

  updateHelperVideo: (
    id: number,
    data: UpdateHelperVideoDto
  ) => Promise<HelperVideos>;
  deleteHelperVideo: (id: number) => Promise<HelperVideos>;

  updatePreference: (
    id: number,
    data: UpdatePreferenceDto
  ) => Promise<Preferences>;
  deletePreference: (id: number) => Promise<Preferences>;

  updatePreferenceJob: (
    id: number,
    data: UpdatePreferenceJobDto
  ) => Promise<PreferenceJobs>;
  deletePreferenceJob: (id: number) => Promise<PreferenceJobs>;

  updatePreferenceLocation: (
    id: number,
    data: UpdatePreferenceLocationDto
  ) => Promise<PreferenceLocations>;
  deletePreferenceLocation: (id: number) => Promise<PreferenceLocations>;
}

export interface IResumeController {
  upload: (req: Request, res: Response) => Promise<Response>;
  createResume: (req: Request, res: Response) => Promise<Response>;
  findPublicResumes: (
    req: Request<unknown, unknown, unknown, { start: string; limit: string }>,
    res: Response
  ) => Promise<Response>;
  findMyResumes: (req: Request, res: Response) => Promise<Response>;

  findResumeById: (req: Request, res: Response) => Promise<Response>;
  updateResumeById: (req: Request, res: Response) => Promise<Response>;
  deleteResume: (req: Request, res: Response) => Promise<Response>;

  updateResumeInfo: (req: Request, res: Response) => Promise<Response>;
  deleteResumeInfo: (req: Request, res: Response) => Promise<Response>;

  updateEducation: (req: Request, res: Response) => Promise<Response>;
  deleteEducation: (req: Request, res: Response) => Promise<Response>;

  updateCareer: (req: Request, res: Response) => Promise<Response>;
  deleteCareer: (req: Request, res: Response) => Promise<Response>;

  updateActivity: (req: Request, res: Response) => Promise<Response>;
  deleteActivity: (req: Request, res: Response) => Promise<Response>;

  updateAward: (req: Request, res: Response) => Promise<Response>;
  deleteAward: (req: Request, res: Response) => Promise<Response>;

  updateMyVideo: (req: Request, res: Response) => Promise<Response>;
  deleteMyVideo: (req: Request, res: Response) => Promise<Response>;

  updateHelperVideo: (req: Request, res: Response) => Promise<Response>;
  deleteHelperVideo: (req: Request, res: Response) => Promise<Response>;

  updatePreference: (req: Request, res: Response) => Promise<Response>;
  deletePreference: (req: Request, res: Response) => Promise<Response>;

  updatePreferenceJob: (req: Request, res: Response) => Promise<Response>;
  deletePreferenceJob: (req: Request, res: Response) => Promise<Response>;

  updatePreferenceLocation: (req: Request, res: Response) => Promise<Response>;
  deletePreferenceLocation: (req: Request, res: Response) => Promise<Response>;
}
