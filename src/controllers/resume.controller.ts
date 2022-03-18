/* eslint-disable camelcase */
import { Response, Request } from "express";
import { Service } from "typedi";
import { ResumeService } from "../services";
import { IResumeController } from "../types";
import { assertNonNullish, parseToNumberOrThrow, validateDtos } from "../utils";
import { MulterS3, NotFoundError } from "../lib";
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
// import { S3_BUCKET } from "../config";

type ReqParams = {
  id?: string;
};

@Service()
export class ResumeController implements IResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly multerS3: MulterS3
  ) {}

  uploadVideo = async ({ file }: Request<unknown, unknown>, res: Response) => {
    assertNonNullish(file?.key);
    const url = this.multerS3.getSignedUrl(file.key);

    return res.json({ file, url });
  };

  createResume = async (
    { body, user }: Request<unknown, unknown, CreateResumeDto>,
    res: Response
  ) => {
    await validateDtos(new CreateResumeDto(body));

    await this.resumeService.createResume(user!.id, body);

    return res.sendStatus(204);
  };

  findResumeById = async (
    { params: { id } }: Request<ReqParams>,
    res: Response
  ) => {
    assertNonNullish(id);

    const resume = await this.resumeService.findResumeById(
      parseToNumberOrThrow(id)
    );
    assertNonNullish(resume);

    return res.json({ resume });
  };

  updateResumeById = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateResumeDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateResumeDto(body));

    const [result] = await this.resumeService.updateResume(
      parseToNumberOrThrow(id),
      body
    );

    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }

    return res.sendStatus(204);
  };

  updateResumeInfo = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateResumeInfoDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateResumeInfoDto(body));

    const [result] = await this.resumeService.updateResumeInfo(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }

    return res.sendStatus(204);
  };

  updateEducation = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateEducationDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateEducationDto(body));

    const [result] = await this.resumeService.updateEducation(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  updateCareer = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateCareerDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateCareerDto(body));

    const [result] = await this.resumeService.updateCareer(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  updateActivity = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateActivityDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateActivityDto(body));
    const [result] = await this.resumeService.updateActivity(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  updateAward = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateAwardDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateAwardDto(body));

    const [result] = await this.resumeService.updateAward(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  updateMyVideo = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateMyVideoDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateMyVideoDto(body));

    const [result] = await this.resumeService.updateMyVideo(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  updateHelperVideo = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateHelperVideoDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateHelperVideoDto(body));

    const [result] = await this.resumeService.updateHelperVideo(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  updatePreference = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdatePreferenceDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdatePreferenceDto(body));

    const [result] = await this.resumeService.updatePreference(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  updatePreferenceJob = async (
    {
      params: { id },
      body,
    }: Request<ReqParams, unknown, UpdatePreferenceJobDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdatePreferenceJobDto(body));

    const [result] = await this.resumeService.updatePreferenceJob(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  updatePreferenceLocation = async (
    {
      params: { id },
      body,
    }: Request<ReqParams, unknown, UpdatePreferenceLocationDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdatePreferenceLocationDto(body));

    const [result] = await this.resumeService.updatePreferenceLocation(
      parseToNumberOrThrow(id),
      body
    );
    if (result.affectedRows === 0) {
      throw new NotFoundError();
    }
    return res.sendStatus(204);
  };

  deleteResume = async (
    { params: { id } }: Request<ReqParams>,
    res: Response
  ) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deleteResume(
      parseToNumberOrThrow(id)
    );

    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };

  deleteResumeInfo = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deleteResumeInfo(
      parseToNumberOrThrow(id)
    );

    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };

  deleteEducation = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deleteEducation(
      parseToNumberOrThrow(id)
    );

    assertNonNullish(affectedRows);
    return res.sendStatus(204);
  };

  deleteCareer = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deleteCareer(
      parseToNumberOrThrow(id)
    );
    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };

  deleteActivity = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deleteActivity(
      parseToNumberOrThrow(id)
    );
    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };

  deleteAward = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deleteAward(
      parseToNumberOrThrow(id)
    );
    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };

  deleteMyVideo = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deleteMyVideo(
      parseToNumberOrThrow(id)
    );
    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };

  deleteHelperVideo = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deleteHelperVideo(
      parseToNumberOrThrow(id)
    );
    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };

  deletePreference = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deletePreference(
      parseToNumberOrThrow(id)
    );
    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };

  deletePreferenceJob = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const [{ affectedRows }] = await this.resumeService.deletePreferenceJob(
      parseToNumberOrThrow(id)
    );
    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };

  deletePreferenceLocation = async (
    { params: { id } }: Request,
    res: Response
  ) => {
    assertNonNullish(id);

    const [{ affectedRows }] =
      await this.resumeService.deletePreferenceLocation(
        parseToNumberOrThrow(id)
      );

    assertNonNullish(affectedRows);

    return res.sendStatus(204);
  };
}
