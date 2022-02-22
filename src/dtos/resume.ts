import {
  IActivity,
  IAward,
  ICareers,
  IEducation,
  IHelperVideo,
  IMyVideo,
  IPreference,
  IPreferenceJob,
  IPreferenceLocation,
  IResume,
  IResumeInfo,
} from "../types";

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
  preferenceLocation: Partial<
    Omit<IPreferenceLocation, "id" | "preference_id">
  >;
}

export interface findResumeDTO extends Omit<IResume, "user_id"> {
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
