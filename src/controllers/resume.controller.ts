import { Response, Request } from "express";
import { Service } from "typedi";
import { plainToInstance } from "class-transformer";
import { ResumeService } from "../services";
import { IResumeController } from "../types";
import { assertNonNullish, parseToNumberOrThrow, validateDtos } from "../utils";
import { MulterS3 } from "../lib";
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
  CreateEducationDto,
  CreateCareerDto,
  CreateActivityDto,
} from "../dtos";

type ReqParams = {
  id?: string;
};

@Service()
export class ResumeController implements IResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly multerS3: MulterS3
  ) {}

  upload = async ({ file }: Request<unknown, unknown>, res: Response) => {
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

  findPublicResumes = async (
    {
      query: { start, limit },
    }: Request<unknown, unknown, unknown, { start: string; limit: string }>,
    res: Response
  ) => {
    assertNonNullish(start);
    assertNonNullish(limit);

    const parsedQuery = {
      start: parseToNumberOrThrow(start),
      limit: parseToNumberOrThrow(limit),
    };
    const resumes = await this.resumeService.findPublicResumes(parsedQuery);

    if (!resumes.length) {
      return res.status(204).send();
    }

    return res.json({ resumes });
  };

  findMyResumes = async ({ user }: Request, res: Response) => {
    const resumes = await this.resumeService.findMyResumes(user!.id);

    if (!resumes.length) {
      return res.status(204).send();
    }

    return res.json({ resumes });
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

    const resume = await this.resumeService.updateResume(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ resume });
  };

  updateResumeInfo = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateResumeInfoDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateResumeInfoDto(body));

    const resumeInfo = await this.resumeService.updateResumeInfo(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ resumeInfo });
  };

  updateEducation = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateEducationDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateEducationDto(body));

    const education = await this.resumeService.updateEducation(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ education });
  };

  createEducation = async (
    { params: { id }, body }: Request<ReqParams, unknown, CreateEducationDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(plainToInstance(CreateEducationDto, body));
    // await validateDtos(new CreateEducationDto(body));

    const education = await this.resumeService.createEducation(
      Number(id),
      body
    );

    return res.json({ education });
  };

  updateCareer = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateCareerDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateCareerDto(body));

    const career = await this.resumeService.updateCareer(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ career });
  };

  createCareer = async (
    { params: { id }, body }: Request<ReqParams, unknown, CreateCareerDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(plainToInstance(CreateCareerDto, body));

    const career = await this.resumeService.createCareer(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ career });
  };

  updateActivity = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateActivityDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateActivityDto(body));
    const activity = await this.resumeService.updateActivity(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ activity });
  };

  createActivity = async (
    { params: { id }, body }: Request<ReqParams, unknown, CreateActivityDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(plainToInstance(CreateActivityDto, body));

    const activity = await this.resumeService.createActivity(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ activity });
  };

  updateAward = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateAwardDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateAwardDto(body));

    const award = await this.resumeService.updateAward(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ award });
  };

  updateMyVideo = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateMyVideoDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateMyVideoDto(body));

    const myVideo = await this.resumeService.updateMyVideo(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ myVideo });
  };

  updateHelperVideo = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdateHelperVideoDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdateHelperVideoDto(body));

    const helperVideo = await this.resumeService.updateHelperVideo(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ helperVideo });
  };

  updatePreference = async (
    { params: { id }, body }: Request<ReqParams, unknown, UpdatePreferenceDto>,
    res: Response
  ) => {
    assertNonNullish(id);

    await validateDtos(new UpdatePreferenceDto(body));

    const preference = await this.resumeService.updatePreference(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ preference });
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

    const preferenceJob = await this.resumeService.updatePreferenceJob(
      parseToNumberOrThrow(id),
      body
    );

    return res.json({ preferenceJob });
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

    const preferenceLocation =
      await this.resumeService.updatePreferenceLocation(
        parseToNumberOrThrow(id),
        body
      );

    return res.json({ preferenceLocation });
  };

  deleteResume = async (
    { params: { id } }: Request<ReqParams>,
    res: Response
  ) => {
    assertNonNullish(id);

    const resume = await this.resumeService.deleteResume(
      parseToNumberOrThrow(id)
    );

    // assertNonNullish(resume);

    return res.json({ resume });
  };

  deleteResumeInfo = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const resumeInfo = await this.resumeService.deleteResumeInfo(
      parseToNumberOrThrow(id)
    );

    // assertNonNullish(affectedRows);

    return res.json({ resumeInfo });
  };

  deleteEducation = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const education = await this.resumeService.deleteEducation(
      parseToNumberOrThrow(id)
    );

    // assertNonNullish(affectedRows);
    return res.json({ education });
  };

  deleteCareer = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const career = await this.resumeService.deleteCareer(
      parseToNumberOrThrow(id)
    );
    // assertNonNullish(affectedRows);

    return res.json({ career });
  };

  deleteActivity = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const activity = await this.resumeService.deleteActivity(
      parseToNumberOrThrow(id)
    );
    // assertNonNullish(affectedRows);

    return res.json({ activity });
  };

  deleteAward = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const award = await this.resumeService.deleteAward(
      parseToNumberOrThrow(id)
    );
    // assertNonNullish(affectedRows);

    return res.json({ award });
  };

  deleteMyVideo = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const myVideo = await this.resumeService.deleteMyVideo(
      parseToNumberOrThrow(id)
    );
    // assertNonNullish(affectedRows);

    return res.json({ myVideo });
  };

  deleteHelperVideo = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const helperVideo = await this.resumeService.deleteHelperVideo(
      parseToNumberOrThrow(id)
    );
    // assertNonNullish(affectedRows);

    return res.json({ helperVideo });
  };

  deletePreference = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const preference = await this.resumeService.deletePreference(
      parseToNumberOrThrow(id)
    );
    // assertNonNullish(affectedRows);

    return res.json({ preference });
  };

  deletePreferenceJob = async ({ params: { id } }: Request, res: Response) => {
    assertNonNullish(id);

    const preferenceJob = await this.resumeService.deletePreferenceJob(
      parseToNumberOrThrow(id)
    );
    // assertNonNullish(affectedRows);

    return res.json({ preferenceJob });
  };

  deletePreferenceLocation = async (
    { params: { id } }: Request,
    res: Response
  ) => {
    assertNonNullish(id);

    const preferenceLocation =
      await this.resumeService.deletePreferenceLocation(
        parseToNumberOrThrow(id)
      );

    // assertNonNullish(affectedRows);

    return res.json({ preferenceLocation });
  };
}
