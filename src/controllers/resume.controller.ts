/* eslint-disable camelcase */
import { Response, Request } from "express";
import { Service } from "typedi";
import { ResumeService } from "../services";
import { IResumeController } from "../types";
import { BadReqError } from "../utils";
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

type ReqParams = {
  id?: string;
};

@Service()
export class ResumeController implements IResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  createResume = async (
    { body, user }: Request<unknown, unknown, createResumeDTO>,
    res: Response
  ) => {
    // TODO validation pipe 구축
    if (!body) {
      throw new BadReqError();
    }

    const {
      resume: { title, content },
      resumeInfo: {
        name,
        birthday,
        phone_number,
        email,
        sido,
        sigungu,
        disability_level,
        disability_type,
        sex,
      },
      educations,
      careers,
      activities,
      awards,
      myVideo,
      helperVideo,
      preference: { preferenceJobs, preferenceLocations, ...preference },
    } = body;
    if (!title || !content) {
      throw new BadReqError("Resume");
    }

    if (
      !name ||
      !birthday ||
      !phone_number ||
      !email ||
      !sido ||
      !sigungu ||
      !disability_level ||
      !disability_type ||
      !sex
    ) {
      throw new BadReqError("resumeInfo");
    }
    if (!title || !content) {
      throw new BadReqError("Resume");
    }

    educations.forEach(
      ({
        type,
        school_name,
        graduation_year,
        admission_year,
        is_graduated,
        major,
        credit,
        total_credit,
      }) => {
        if (
          !type ||
          !school_name ||
          !graduation_year ||
          !admission_year ||
          !is_graduated ||
          !major ||
          !credit ||
          !total_credit
        ) {
          throw new BadReqError("Education");
        }
      }
    );
    if (!careers) {
      throw new BadReqError("ICarrer");
    }
    careers.forEach(({ company, department, position, task, joined_at }) => {
      if (!company || !department || !position || !task || !joined_at) {
        throw new BadReqError("ICarrer");
      }
    });

    if (!activities) {
      throw new BadReqError("IActivity");
    }

    activities.forEach(({ organization, description }) => {
      if (!organization || !description) {
        throw new BadReqError("IActivity");
      }
    });

    if (!awards) {
      throw new BadReqError("IAward");
    }

    awards.forEach(({ institute, started_at, finished_at }) => {
      if (!institute || !started_at || !finished_at) {
        throw new BadReqError("IAward");
      }
    });
    if (!myVideo.url) {
      throw new BadReqError("IMyVideo");
    }
    if (!helperVideo.url) {
      throw new BadReqError("IHelperVideo");
    }

    if (!preference.employ_type || !preference.salary) {
      throw new BadReqError("IPreference");
    }

    if (!preferenceJobs) {
      throw new BadReqError("IPreferenceJob");
    }

    // eslint-disable-next-line no-shadow
    preferenceJobs.forEach(({ name }) => {
      if (!name) {
        throw new BadReqError("IPreferenceJob");
      }
    });

    if (!preferenceLocations) {
      throw new BadReqError("IPreferenceLocation");
    }
    // eslint-disable-next-line no-shadow
    preferenceLocations.forEach(({ sido, sigungu }) => {
      if (!sido || !sigungu) {
        throw new BadReqError("IPreferenceLocation");
      }
    });

    await this.resumeService.createResume(user!.id, body);

    return res.sendStatus(204);
  };

  findResumeById = async (
    { params: { id } }: Request<ReqParams>,
    res: Response
  ) => {
    const parsedInt = Number(id);

    if (!id || !parsedInt) {
      throw new BadReqError();
    }

    const resume = await this.resumeService.findResumeById(parsedInt);

    return res.json({ resume });
  };

  updateResumeById = async (
    { params: { id }, body }: Request<ReqParams, unknown, updateResumeDTO>,
    res: Response
  ) => {
    const parsedInt = Number(id);

    if (!id || !parsedInt) {
      throw new BadReqError();
    }
    await this.resumeService.updateResume(parsedInt, body);

    return res.sendStatus(204);
  };

  updateResumeInfo = async (
    { params: { id }, body }: Request<ReqParams, unknown, updateResumeInfoDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updateResumeInfo(parsedId, body);
    return res.sendStatus(204);
  };

  updateEducation = async (
    { params: { id }, body }: Request<ReqParams, unknown, updateEducationDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updateEducation(parsedId, body);
    return res.sendStatus(204);
  };

  updateCareer = async (
    { params: { id }, body }: Request<ReqParams, unknown, updateCareerDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updateCareer(parsedId, body);
    return res.sendStatus(204);
  };

  updateActivity = async (
    { params: { id }, body }: Request<ReqParams, unknown, updateActivityDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updateActivity(parsedId, body);
    return res.sendStatus(204);
  };

  updateAward = async (
    { params: { id }, body }: Request<ReqParams, unknown, updateAwardDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updateAward(parsedId, body);
    return res.sendStatus(204);
  };

  updateMyVideo = async (
    { params: { id }, body }: Request<ReqParams, unknown, updateMyVideoDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);

    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updateMyVideo(parsedId, body);
    return res.sendStatus(204);
  };

  updateHelperVideo = async (
    { params: { id }, body }: Request<ReqParams, unknown, updateHelperVideoDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);

    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updateHelperVideo(parsedId, body);
    return res.sendStatus(204);
  };

  updatePreference = async (
    { params: { id }, body }: Request<ReqParams, unknown, updatePreferenceDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updatePreference(parsedId, body);
    return res.sendStatus(204);
  };

  updatePreferenceJob = async (
    {
      params: { id },
      body,
    }: Request<ReqParams, unknown, updatePreferenceJobDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updatePreferenceJob(parsedId, body);
    return res.sendStatus(204);
  };

  updatePreferenceLocation = async (
    {
      params: { id },
      body,
    }: Request<ReqParams, unknown, updatePreferenceLocationDTO>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.updatePreferenceLocation(parsedId, body);
    return res.sendStatus(204);
  };

  deleteResume = async (
    { params: { id } }: Request<ReqParams>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }
    await this.resumeService.deleteResume(parsedId);
    return res.sendStatus(204);
  };

  deleteResumeInfo = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deleteResumeInfo(parsedId);
    return res.sendStatus(204);
  };

  deleteEducation = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deleteEducation(parsedId);
    return res.sendStatus(204);
  };

  deleteCareer = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deleteCareer(parsedId);
    return res.sendStatus(204);
  };

  deleteActivity = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deleteActivity(parsedId);
    return res.sendStatus(204);
  };

  deleteAward = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deleteAward(parsedId);
    return res.sendStatus(204);
  };

  deleteMyVideo = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deleteMyVideo(parsedId);
    return res.sendStatus(204);
  };

  deleteHelperVideo = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deleteHelperVideo(parsedId);
    return res.sendStatus(204);
  };

  deletePreference = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deletePreference(parsedId);
    return res.sendStatus(204);
  };

  deletePreferenceJob = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deletePreferenceJob(parsedId);
    return res.sendStatus(204);
  };

  deletePreferenceLocation = async (
    { params: { id } }: Request,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await this.resumeService.deletePreferenceLocation(parsedId);
    return res.sendStatus(204);
  };
}
