/* eslint-disable camelcase */
import { Response, Request } from "express";
import { Service } from "typedi";
import { ResumeService } from "../services";
import { IResumeController } from "../types";
import { BadReqError, NotFoundError, validateDto } from "../utils";
import {
  CreateResumeDto,
  UpdateResumeDto,
  UpdateResumeInfoDto,
  UpdateEducationDto,
  UpdateCareerDto,
  UpdateActivityDto,
  UpdateAwardDto,
  UpdateMyVideoDto,
  UpdateHelperVideoDto,
  UpdatePreferenceDto,
  UpdatePreferenceJobDto,
  UpdatePreferenceLocationDto,
} from "../dtos";

type ReqParams = {
  id?: string;
};

@Service()
export class ResumeController implements IResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  createResume = async (
    { body, user }: Request<unknown, unknown, CreateResumeDto>,
    res: Response
  ) => {
    await validateDto(new CreateResumeDto(body));

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
    if (!resume) {
      throw new NotFoundError();
    }

    return res.json({ resume });
  };

  updateResumeById = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateResumeDto>,
    res: Response
  ) => {
    const parsedInt = Number(id);
    if (!id || !parsedInt) {
      throw new BadReqError();
    }

    await validateDto(new UpdateResumeDto(body));

    const [result] = await this.resumeService.updateResume(parsedInt, body);
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }

    return res.sendStatus(204);
  };

  updateResumeInfo = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateResumeInfoDto>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDto(new UpdateResumeInfoDto(body));

    await this.resumeService.updateResumeInfo(parsedId, body);
    return res.sendStatus(204);
  };

  updateEducation = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateEducationDto>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDto(new UpdateEducationDto(body));

    await this.resumeService.updateEducation(parsedId, body);
    return res.sendStatus(204);
  };

  updateCareer = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateCareerDto>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDto(new UpdateCareerDto(body));

    await this.resumeService.updateCareer(parsedId, body);
    return res.sendStatus(204);
  };

  updateActivity = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateActivityDto>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }
    await validateDto(new UpdateActivityDto(body));
    await this.resumeService.updateActivity(parsedId, body);
    return res.sendStatus(204);
  };

  updateAward = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateAwardDto>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDto(new UpdateAwardDto(body));

    await this.resumeService.updateAward(parsedId, body);
    return res.sendStatus(204);
  };

  updateMyVideo = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateMyVideoDto>,
    res: Response
  ) => {
    const parsedId = Number(id);

    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDto(new UpdateMyVideoDto(body));

    await this.resumeService.updateMyVideo(parsedId, body);
    return res.sendStatus(204);
  };

  updateHelperVideo = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateHelperVideoDto>,
    res: Response
  ) => {
    const parsedId = Number(id);

    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDto(new UpdateHelperVideoDto(body));

    await this.resumeService.updateHelperVideo(parsedId, body);
    return res.sendStatus(204);
  };

  updatePreference = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdatePreferenceDto>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDto(new UpdatePreferenceDto(body));

    await this.resumeService.updatePreference(parsedId, body);
    return res.sendStatus(204);
  };

  updatePreferenceJob = async (
    {
      params: { id },
      body,
    }: Request<ReqParams, unknown, UpdatePreferenceJobDto>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDto(new UpdatePreferenceJobDto(body));

    await this.resumeService.updatePreferenceJob(parsedId, body);
    return res.sendStatus(204);
  };

  updatePreferenceLocation = async (
    {
      params: { id },
      body,
    }: Request<ReqParams, unknown, UpdatePreferenceLocationDto>,
    res: Response
  ) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    await validateDto(new UpdatePreferenceLocationDto(body));

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
    const [{ affectedRows }] = await this.resumeService.deleteResume(parsedId);

    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deleteResumeInfo = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    const [{ affectedRows }] = await this.resumeService.deleteResumeInfo(
      parsedId
    );
    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deleteEducation = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    const [{ affectedRows }] = await this.resumeService.deleteEducation(
      parsedId
    );

    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deleteCareer = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    const [{ affectedRows }] = await this.resumeService.deleteCareer(parsedId);
    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deleteActivity = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    const [{ affectedRows }] = await this.resumeService.deleteActivity(
      parsedId
    );
    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deleteAward = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    const [{ affectedRows }] = await this.resumeService.deleteAward(parsedId);
    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deleteMyVideo = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    const [{ affectedRows }] = await this.resumeService.deleteMyVideo(parsedId);
    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deleteHelperVideo = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    const [{ affectedRows }] = await this.resumeService.deleteHelperVideo(
      parsedId
    );
    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deletePreference = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    const [{ affectedRows }] = await this.resumeService.deletePreference(
      parsedId
    );
    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deletePreferenceJob = async ({ params: { id } }: Request, res: Response) => {
    const parsedId = Number(id);
    if (!parsedId) {
      throw new BadReqError();
    }

    const [{ affectedRows }] = await this.resumeService.deletePreferenceJob(
      parsedId
    );
    if (!affectedRows) {
      throw new NotFoundError();
    }
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

    const [{ affectedRows }] =
      await this.resumeService.deletePreferenceLocation(parsedId);

    if (!affectedRows) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };
}
