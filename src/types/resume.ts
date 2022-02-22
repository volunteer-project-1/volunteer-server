import { Request, Response } from "express";
import { FieldPacket, OkPacket, ResultSetHeader } from "mysql2/promise";
import { DefaultTime } from ".";
import { DISABLILITY_LEVEL, DISABLILITY_TYPE } from "../constants";
import {
  createResumeDTO,
  findResumeDTO,
  updateActivityDTO,
  updateAwardDTO,
  updateCareerDTO,
  updateEducationDTO,
  updateHelperVideoDTO,
  updateMyVideoDTO,
  updatePreferenceDTO,
  updatePreferenceJobDTO,
  updatePreferenceLocationDTO,
  updateResumeDTO,
  updateResumeInfoDTO,
} from "../dtos";

export interface IResume extends DefaultTime {
  id: number;
  title: string;
  content: string;
  user_id: number;
}

type DisabilityLevel = typeof DISABLILITY_LEVEL[number];

type DisabilityType = typeof DISABLILITY_TYPE[number];

type Sex = "남" | "여";

export interface IResumeInfo {
  id: number;
  resume_id: number;
  name: string;
  birthday: Date;
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
  joined_at: Date;
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
  started_at: Date;
  finished_at: Date;
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

export interface IResumeDAO {
  createResume: (
    userId: number,
    data: createResumeDTO
  ) => Promise<{ resume: OkPacket }>;
  findResumeById: (id: number) => Promise<findResumeDTO>;
  updateResume: (
    id: number,
    data: createResumeDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteResume: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateResumeInfo: (
    id: number,
    data: updateResumeInfoDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteResumeInfo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateEducation: (
    id: number,
    data: updateEducationDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteEducation: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateCareer: (
    id: number,
    data: updateCareerDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteCareer: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateActivity: (
    id: number,
    data: updateActivityDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteActivity: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateAward: (
    id: number,
    data: updateAwardDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteAward: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateMyVideo: (
    id: number,
    data: updateMyVideoDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteMyVideo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateHelperVideo: (
    id: number,
    data: updateHelperVideoDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteHelperVideo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreference: (
    id: number,
    data: updatePreferenceDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreference: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreferenceJob: (
    id: number,
    data: updatePreferenceJobDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreferenceJob: (
    id: number
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreferenceLocation: (
    id: number,
    data: updatePreferenceLocationDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreferenceLocation: (
    id: number
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
}

export interface IResumeService {
  createResume: (
    id: number,
    data: createResumeDTO
  ) => Promise<{ resume: OkPacket }>;
  findResumeById: (resumeId: number) => Promise<findResumeDTO>;
  updateResume: (
    resumeId: number,
    data: updateResumeDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteResume: (resumeId: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateResumeInfo: (
    id: number,
    data: updateResumeInfoDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteResumeInfo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateEducation: (
    id: number,
    data: updateEducationDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteEducation: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateCareer: (
    id: number,
    data: updateCareerDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteCareer: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateActivity: (
    id: number,
    data: updateActivityDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteActivity: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateAward: (
    id: number,
    data: updateAwardDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteAward: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateMyVideo: (
    id: number,
    data: updateMyVideoDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteMyVideo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updateHelperVideo: (
    id: number,
    data: updateHelperVideoDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deleteHelperVideo: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreference: (
    id: number,
    data: updatePreferenceDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreference: (id: number) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreferenceJob: (
    id: number,
    data: updatePreferenceJobDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreferenceJob: (
    id: number
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;

  updatePreferenceLocation: (
    id: number,
    data: updatePreferenceLocationDTO
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
  deletePreferenceLocation: (
    id: number
  ) => Promise<[ResultSetHeader, FieldPacket[]]>;
}

export interface IResumeController {
  createResume: (req: Request, res: Response) => Promise<Response>;
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
