import { Service } from "typedi";
import { ResumeDAO } from "../daos";
import {
  UpdateResumeDto,
  CreateResumeDto,
  UpdateActivityDto,
  CreateActivityDto,
  UpdateAwardDto,
  CreateAwardDto,
  CreateCareerDto,
  UpdateEducationDto,
  CreateEducationDto,
  UpdateHelperVideoDto,
  UpdateMyVideoDto,
  CreateMyVideoDto,
  UpdatePreferenceDto,
  UpdatePreferenceJobDto,
  UpdatePreferenceLocationDto,
  UpdateResumeInfoDto,
  UpdateCareerDto,
} from "../dtos";
import { IResumeService } from "../types";

@Service()
export class ResumeService implements IResumeService {
  constructor(private resumeDAO: ResumeDAO) {}

  createResume(id: number, data: CreateResumeDto) {
    return this.resumeDAO.createResume(id, data);
  }

  findPublicResumes(pageNation: { start: number; limit: number }) {
    return this.resumeDAO.findPublicResumes(pageNation);
  }

  findMyResumes(id: number) {
    return this.resumeDAO.findMyResumes(id);
  }

  findResumeById(id: number) {
    return this.resumeDAO.findResumeById(id);
  }

  updateResume(id: number, data: UpdateResumeDto) {
    return this.resumeDAO.updateResume(id, data);
  }

  updateResumeInfo(id: number, data: UpdateResumeInfoDto) {
    return this.resumeDAO.updateResumeInfo(id, data);
  }

  updateEducation(id: number, data: UpdateEducationDto) {
    return this.resumeDAO.updateEducation(id, data);
  }

  createEducation(id: number, data: CreateEducationDto) {
    return this.resumeDAO.createEducation(id, data);
  }

  updateCareer(id: number, data: UpdateCareerDto) {
    return this.resumeDAO.updateCareer(id, data);
  }

  createCareer(id: number, data: CreateCareerDto) {
    return this.resumeDAO.createCareer(id, data);
  }

  updateActivity(id: number, data: UpdateActivityDto) {
    return this.resumeDAO.updateActivity(id, data);
  }

  createActivity(id: number, data: CreateActivityDto) {
    return this.resumeDAO.createActivity(id, data);
  }

  updateAward(id: number, data: UpdateAwardDto) {
    return this.resumeDAO.updateAward(id, data);
  }

  createAward(id: number, data: CreateAwardDto) {
    return this.resumeDAO.createAward(id, data);
  }

  updateMyVideo(id: number, data: UpdateMyVideoDto) {
    return this.resumeDAO.updateMyVideo(id, data);
  }

  createMyVideo(id: number, data: CreateMyVideoDto) {
    return this.resumeDAO.createMyVideo(id, data);
  }

  updateHelperVideo(id: number, data: UpdateHelperVideoDto) {
    return this.resumeDAO.updateHelperVideo(id, data);
  }

  updatePreference(id: number, data: UpdatePreferenceDto) {
    return this.resumeDAO.updatePreference(id, data);
  }

  updatePreferenceJob(id: number, data: UpdatePreferenceJobDto) {
    return this.resumeDAO.updatePreferenceJob(id, data);
  }

  updatePreferenceLocation(id: number, data: UpdatePreferenceLocationDto) {
    return this.resumeDAO.updatePreferenceLocation(id, data);
  }

  deleteResume(id: number) {
    return this.resumeDAO.deleteResume(id);
  }

  deleteResumeInfo(id: number) {
    return this.resumeDAO.deleteResumeInfo(id);
  }

  deleteEducation(id: number) {
    return this.resumeDAO.deleteEducation(id);
  }

  deleteCareer(id: number) {
    return this.resumeDAO.deleteCareer(id);
  }

  deleteActivity(id: number) {
    return this.resumeDAO.deleteActivity(id);
  }

  deleteAward(id: number) {
    return this.resumeDAO.deleteAward(id);
  }

  deleteMyVideo(id: number) {
    return this.resumeDAO.deleteMyVideo(id);
  }

  deleteHelperVideo(id: number) {
    return this.resumeDAO.deleteHelperVideo(id);
  }

  deletePreference(id: number) {
    return this.resumeDAO.deletePreference(id);
  }

  deletePreferenceJob(id: number) {
    return this.resumeDAO.deletePreferenceJob(id);
  }

  deletePreferenceLocation(id: number) {
    return this.resumeDAO.deletePreferenceLocation(id);
  }
}
