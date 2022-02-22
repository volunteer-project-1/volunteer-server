import { Service } from "typedi";
import { ResumeDAO } from "../daos";
import {
  createResumeDTO,
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
import { IResumeService } from "../types";

@Service()
export class ResumeService implements IResumeService {
  constructor(private resumeDAO: ResumeDAO) {}

  createResume(id: number, data: createResumeDTO) {
    return this.resumeDAO.createResume(id, data);
  }

  findResumeById(id: number) {
    return this.resumeDAO.findResumeById(id);
  }

  updateResume(id: number, data: updateResumeDTO) {
    return this.resumeDAO.updateResume(id, data);
  }

  updateResumeInfo(id: number, data: updateResumeInfoDTO) {
    return this.resumeDAO.updateResumeInfo(id, data);
  }

  updateEducation(id: number, data: updateEducationDTO) {
    return this.resumeDAO.updateEducation(id, data);
  }

  updateCareer(id: number, data: updateCareerDTO) {
    return this.resumeDAO.updateCareer(id, data);
  }

  updateActivity(id: number, data: updateActivityDTO) {
    return this.resumeDAO.updateActivity(id, data);
  }

  updateAward(id: number, data: updateAwardDTO) {
    return this.resumeDAO.updateAward(id, data);
  }

  updateMyVideo(id: number, data: updateMyVideoDTO) {
    return this.resumeDAO.updateMyVideo(id, data);
  }

  updateHelperVideo(id: number, data: updateHelperVideoDTO) {
    return this.resumeDAO.updateHelperVideo(id, data);
  }

  updatePreference(id: number, data: updatePreferenceDTO) {
    return this.resumeDAO.updatePreference(id, data);
  }

  updatePreferenceJob(id: number, data: updatePreferenceJobDTO) {
    return this.resumeDAO.updatePreferenceJob(id, data);
  }

  updatePreferenceLocation(id: number, data: updatePreferenceLocationDTO) {
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
