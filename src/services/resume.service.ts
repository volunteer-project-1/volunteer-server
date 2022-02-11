import { Service } from "typedi";
import { ResumeDAO } from "../daos";
import { createResumeDTO, IResumeService } from "../types";

@Service()
export class ResumeService implements IResumeService {
  constructor(private resumeDAO: ResumeDAO) {}

  createResume(id: number, data: createResumeDTO) {
    return this.resumeDAO.createResume(id, data);
  }

  findResumeById(resumeId: number) {
    return this.resumeDAO.findResumeById(resumeId);
  }
}
