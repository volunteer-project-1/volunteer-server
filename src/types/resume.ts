import { Request, Response } from "express";
import { FieldPacket, OkPacket, ResultSetHeader } from "mysql2/promise";
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
  user_id: number;
}

export interface IResumeInfo {
  id: number;
  resume_id: number;
  name: string;
  birthday: string;
  phone_number: string;
  email: string;
  sido: string;
  sigungu: string;
  disability_level: DisabilityLevel;
  disability_type: DisabilityType;
  sex: Sex;
}

export interface IEducation {
  id: number;
  resume_id: number;
  type: string;
  school_name: string;
  graduation_year: string;
  admission_year: string;
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

export interface IAward {
  id: number;
  resume_id: number;
  institute: string;
  started_at: string;
  finished_at: string;
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
  resume: Omit<IResume, "id" | "user_id">;
  resumeInfo: Omit<IResumeInfo, "id" | "resume_id">;
  educations: Omit<IEducation, "id" | "resume_id">[];
  careers: Omit<ICareers, "id" | "resume_id">[];
  activities: Omit<IActivity, "id" | "resume_id">[];
  awards: Omit<IAward, "id" | "resume_id">[];
  myVideo: Omit<IMyVideo, "id" | "resume_id">;
  helperVideo: Omit<IHelperVideo, "id" | "resume_id">;
  preference: Omit<IPreference, "id" | "resume_id"> & {
    preferenceLocations: Omit<IPreferenceLocation, "id" | "preference_id">[];
    preferenceJobs: Omit<IPreferenceJob, "id" | "preference_id">[];
  };
}

export interface IUpdateResume {
  resume: Partial<Omit<IResume, "id" | "user_id">>;
}
export interface IUpdateResumeInfo {
  resumeInfo: Partial<Omit<IResumeInfo, "id" | "resume_id">>;
}
export interface IUpdateEducation {
  education: Partial<Omit<IEducation, "id" | "resume_id">>;
}
export interface IUpdateCareer {
  career: Partial<Omit<ICareers, "id" | "resume_id">>;
}
export interface IUpdateActivity {
  activity: Partial<Omit<IActivity, "id" | "resume_id">>;
}
export interface IUpdateAward {
  award: Partial<Omit<IAward, "id" | "resume_id">>;
}
export interface IUpdateMyVideo {
  myVideo: Partial<Omit<IMyVideo, "id" | "resume_id">>;
}
export interface IUpdateHelperVideo {
  helperVideo: Partial<Omit<IHelperVideo, "id" | "resume_id">>;
}

export interface IUpdatePreference {
  preference: Partial<Omit<IPreference, "id" | "resume_id">>;
}
export interface IUpdatePreferenceJob {
  preferenceJob: Partial<Omit<IPreferenceJob, "id" | "preference_id">>;
}
export interface IUpdatePreferenceLocation {
  preferenceLocation: Partial<
    Omit<IPreferenceLocation, "id" | "preference_id">
  >;
}

export type IFindResume = Omit<IResume, "user_id">;

export interface IFindWholeResume extends Omit<IResume, "user_id"> {
  educations: IEducation[];
  careers: ICareers[];
  activities: IActivity[];
  awards: IAward[];
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
  ) => Promise<{ resume: OkPacket }>;
  findMyResumes: (id: number) => Promise<IFindResume[]>;
  findResumeById: (id: number) => Promise<IFindWholeResume>;
  updateResume: (
    id: number,
    data: UpdateResumeDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteResume: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateResumeInfo: (
    id: number,
    data: UpdateResumeInfoDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteResumeInfo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateEducation: (
    id: number,
    data: UpdateEducationDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteEducation: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateCareer: (
    id: number,
    data: UpdateCareerDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteCareer: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateActivity: (
    id: number,
    data: UpdateActivityDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteActivity: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateAward: (
    id: number,
    data: UpdateAwardDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteAward: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateMyVideo: (
    id: number,
    data: UpdateMyVideoDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteMyVideo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateHelperVideo: (
    id: number,
    data: UpdateHelperVideoDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteHelperVideo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreference: (
    id: number,
    data: UpdatePreferenceDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreference: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreferenceJob: (
    id: number,
    data: UpdatePreferenceJobDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreferenceJob: (
    id: number
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreferenceLocation: (
    id: number,
    data: UpdatePreferenceLocationDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreferenceLocation: (
    id: number
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
}

export interface IResumeService {
  createResume: (
    id: number,
    data: CreateResumeDto
  ) => Promise<{ resume: OkPacket }>;
  findMyResumes: (id: number) => Promise<IFindResume[]>;
  findResumeById: (resumeId: number) => Promise<IFindWholeResume>;
  updateResume: (
    resumeId: number,
    data: UpdateResumeDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteResume: (resumeId: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateResumeInfo: (
    id: number,
    data: UpdateResumeInfoDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteResumeInfo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateEducation: (
    id: number,
    data: UpdateEducationDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteEducation: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateCareer: (
    id: number,
    data: UpdateCareerDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteCareer: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateActivity: (
    id: number,
    data: UpdateActivityDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteActivity: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateAward: (
    id: number,
    data: UpdateAwardDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteAward: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateMyVideo: (
    id: number,
    data: UpdateMyVideoDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteMyVideo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateHelperVideo: (
    id: number,
    data: UpdateHelperVideoDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteHelperVideo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreference: (
    id: number,
    data: UpdatePreferenceDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreference: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreferenceJob: (
    id: number,
    data: UpdatePreferenceJobDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreferenceJob: (
    id: number
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreferenceLocation: (
    id: number,
    data: UpdatePreferenceLocationDto
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreferenceLocation: (
    id: number
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
}

export interface IResumeController {
  uploadVideo: (req: Request, res: Response) => Promise<Response>;
  createResume: (req: Request, res: Response) => Promise<Response>;
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
