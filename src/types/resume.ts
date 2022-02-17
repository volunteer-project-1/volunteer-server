import { Request, Response } from "express";
import { DefaultTime } from ".";

export interface IResume extends DefaultTime {
  id: number;
  title: string;
  content: string;
  user_id: number;
}
const DISABLILITY_LEVEL = [1, 2, 3, 4, 5, 6] as const;
type DisabilityLevel = typeof DISABLILITY_LEVEL[number];

const DISABLILITY_TYPE = [
  "지체 장애",
  "뇌병변 장애",
  "시각 장애",
  "청각 장애",
  "언어 장애",
  "안면 장애",
  "신장 장애",
  "심장 장애",
  "간 장애",
  "호흡기 장애",
  "장루요루 장애",
  "뇌전증 장애",
  "정신 지체",
  "정신 장애",
  "자폐성 장애",
] as const;
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

export interface createResumeDTO {
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

export interface updateResumeDTO {
  resume: Partial<Omit<IResume, "id" | "user_id">>;
}

export interface updateResumeInfoDTO {
  resumeInfo: Partial<Omit<IResumeInfo, "id" | "resume_id">>;
}
export interface updateEducationDTO {
  education: Partial<Omit<IEducation, "id" | "resume_id">>;
}
export interface updateCareerDTO {
  career: Partial<Omit<ICareers, "id" | "resume_id">>;
}
export interface updateActivityDTO {
  activity: Partial<Omit<IActivity, "id" | "resume_id">>;
}
export interface updateAwardDTO {
  award: Partial<Omit<IAward, "id" | "resume_id">>;
}
export interface updateMyVideoDTO {
  myVideo: Partial<Omit<IMyVideo, "id" | "resume_id">>;
}
export interface updateHelperVideoDTO {
  helperVideo: Partial<Omit<IHelperVideo, "id" | "resume_id">>;
}

export interface updatePreferenceDTO {
  preference: Partial<Omit<IPreference, "id" | "resume_id">>;
}
export interface updatePreferenceJobDTO {
  preferenceJob: Partial<Omit<IPreferenceJob, "id" | "preference_id">>;
}
export interface updatePreferenceLocationDTO {
  preferenceLocation: Partial<Omit<IPreference, "id" | "preference_id">>;
}

export interface findResumeDTO extends IResume {
  type: string;
  school_name: string;
}

export interface IResumeDAO {
  createResume: (userId: number, data: createResumeDTO) => Promise<void>;
  findResumeById: (id: number) => Promise<findResumeDTO>;
  updateResume: (id: number, data: createResumeDTO) => Promise<void>;
  deleteResume: (id: number) => Promise<void>;

  updateResumeInfo: (id: number, data: updateResumeInfoDTO) => Promise<void>;
  deleteResumeInfo: (id: number) => Promise<void>;

  updateEducation: (id: number, data: updateEducationDTO) => Promise<void>;
  deleteEducation: (id: number) => Promise<void>;

  updateCareer: (id: number, data: updateCareerDTO) => Promise<void>;
  deleteCareer: (id: number) => Promise<void>;

  updateActivity: (id: number, data: updateActivityDTO) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;

  updateAward: (id: number, data: updateAwardDTO) => Promise<void>;
  deleteAward: (id: number) => Promise<void>;

  updateMyVideo: (id: number, data: updateMyVideoDTO) => Promise<void>;
  deleteMyVideo: (id: number) => Promise<void>;

  updateHelperVideo: (id: number, data: updateHelperVideoDTO) => Promise<void>;
  deleteHelperVideo: (id: number) => Promise<void>;

  updatePreference: (id: number, data: updatePreferenceDTO) => Promise<void>;
  deletePreference: (id: number) => Promise<void>;

  updatePreferenceJob: (
    id: number,
    data: updatePreferenceJobDTO
  ) => Promise<void>;
  deletePreferenceJob: (id: number) => Promise<void>;

  updatePreferenceLocation: (
    id: number,
    data: updatePreferenceLocationDTO
  ) => Promise<void>;
  deletePreferenceLocation: (id: number) => Promise<void>;
}

export interface IResumeService {
  createResume: (id: number, data: createResumeDTO) => Promise<void>;
  findResumeById: (resumeId: number) => Promise<findResumeDTO>;
  updateResume: (resumeId: number, data: updateResumeDTO) => Promise<void>;
  deleteResume: (resumeId: number) => Promise<void>;

  updateResumeInfo: (id: number, data: updateResumeInfoDTO) => Promise<void>;
  deleteResumeInfo: (id: number) => Promise<void>;

  updateEducation: (id: number, data: updateEducationDTO) => Promise<void>;
  deleteEducation: (id: number) => Promise<void>;

  updateCareer: (id: number, data: updateCareerDTO) => Promise<void>;
  deleteCareer: (id: number) => Promise<void>;

  updateActivity: (id: number, data: updateActivityDTO) => Promise<void>;
  deleteActivity: (id: number) => Promise<void>;

  updateAward: (id: number, data: updateAwardDTO) => Promise<void>;
  deleteAward: (id: number) => Promise<void>;

  updateMyVideo: (id: number, data: updateMyVideoDTO) => Promise<void>;
  deleteMyVideo: (id: number) => Promise<void>;

  updateHelperVideo: (id: number, data: updateHelperVideoDTO) => Promise<void>;
  deleteHelperVideo: (id: number) => Promise<void>;

  updatePreference: (id: number, data: updatePreferenceDTO) => Promise<void>;
  deletePreference: (id: number) => Promise<void>;

  updatePreferenceJob: (
    id: number,
    data: updatePreferenceJobDTO
  ) => Promise<void>;
  deletePreferenceJob: (id: number) => Promise<void>;

  updatePreferenceLocation: (
    id: number,
    data: updatePreferenceLocationDTO
  ) => Promise<void>;
  deletePreferenceLocation: (id: number) => Promise<void>;
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
