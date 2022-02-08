/* eslint-disable camelcase */
import { Response, Request } from "express";
import { Service } from "typedi";
import { ResumeService } from "../services";
import { createResumeDTO, IResumeController } from "../types";
import { BadReqError } from "../utils";

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
}
