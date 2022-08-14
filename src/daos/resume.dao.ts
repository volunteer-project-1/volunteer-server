/* eslint-disable no-return-await */
import { Service } from "typedi";
import {
  Activities,
  Awards,
  Careers,
  Certificates,
  Educations,
  Introductions,
  PreferenceJobs,
  PreferenceLocations,
  Preferences,
  Resumes,
  Trainings,
} from "@prisma/client";
import { IResumeDAO, IUpdateResume } from "../types";
import {
  ActivityDto,
  AwardDto,
  CareerDto,
  CreateResumeDto,
  EducationDto,
  HelperVideoDto,
  MyVideoDto,
  PreferenceDto,
  PreferenceJobDto,
  PreferenceLocationDto,
  UpdateActivityDto,
  UpdateAwardDto,
  UpdateCareerDto,
  UpdateEducationDto,
  UpdateHelperVideoDto,
  UpdateMyVideoDto,
  UpdatePreferenceDto,
  UpdatePreferenceJobDto,
  UpdatePreferenceLocationDto,
  UpdateResumeInfoDto,
} from "../dtos";

import Prisma from "../db/prisma";

@Service()
export class ResumeDAO implements IResumeDAO {
  private readonly prisma;

  constructor() {
    this.prisma = Prisma;
  }

  async createResume(
    userId: number,
    {
      resume,
      resumeInfo,
      educations,
      careers,
      activities,
      trainings,
      certificates,
      awards,
      portfolio,
      introductions,
      myVideo,
      helperVideo,
      preference,
    }: CreateResumeDto
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      const resumes = await prisma.resumes.create({
        data: { ...resume, userId },
      });

      const resumeInfos = await prisma.resumeInfos.create({
        data: { ...resumeInfo, resumeId: resumes.id },
      });

      let ed: Educations[] | null = null;
      if (educations) {
        ed = await Promise.all(
          educations
            .map((e) => ({ ...e, resumeId: resumes.id }))
            .map((e) => prisma.educations.create({ data: { ...e } }))
        );
      }

      let ca: Careers[] | null = null;
      if (careers) {
        ca = await Promise.all(
          careers
            .map((e) => ({ ...e, resumeId: resumes.id }))
            .map((e) => prisma.careers.create({ data: { ...e } }))
        );
      }
      let ac: Activities[] | null = null;
      if (activities) {
        ac = await Promise.all(
          activities
            .map((e) => ({ ...e, resumeId: resumes.id }))
            .map((e) => prisma.activities.create({ data: { ...e } }))
        );
      }
      let tr: Trainings[] | null = null;
      if (trainings) {
        tr = await Promise.all(
          trainings
            .map((e) => ({ ...e, resumeId: resumes.id }))
            .map((e) => prisma.trainings.create({ data: { ...e } }))
        );
      }
      let ce: Certificates[] | null = null;
      if (certificates) {
        ce = await Promise.all(
          certificates
            .map((e) => ({ ...e, resumeId: resumes.id }))
            .map((e) => prisma.certificates.create({ data: { ...e } }))
        );
      }
      let aw: Awards[] | null = null;
      if (awards) {
        aw = await Promise.all(
          awards
            .map((e) => ({ ...e, resumeId: resumes.id }))
            .map((e) => prisma.awards.create({ data: { ...e } }))
        );
      }

      let intro: Introductions[] | null = null;
      if (introductions) {
        intro = await Promise.all(
          introductions
            .map((e) => ({ ...e, resumeId: resumes.id }))
            .map((e) => prisma.introductions.create({ data: { ...e } }))
        );
      }

      let pref: Preferences | null = null;
      let prefJobs: PreferenceJobs[] | null = null;
      let prefLocs: PreferenceLocations[] | null = null;

      if (preference) {
        const { preferenceJobs, preferenceLocations, ...restPreference } =
          preference;

        pref = await prisma.preferences.create({
          data: { ...restPreference, resumeId: resumes.id },
        });

        if (preferenceJobs) {
          prefJobs = await Promise.all(
            preferenceJobs
              .map((pj) => ({ ...pj, preferenceId: pref!.id }))
              .map((e) => prisma.preferenceJobs.create({ data: { ...e } }))
          );
        }
        if (preferenceLocations) {
          prefLocs = await Promise.all(
            preferenceLocations
              .map((plc) => ({ ...plc, preferenceId: pref!.id }))
              .map((e) => prisma.preferenceLocations.create({ data: { ...e } }))
          );
        }
      }

      const po =
        portfolio &&
        (await prisma.portfolios.create({
          data: {
            ...portfolio,
            resumeId: resumes.id,
          },
        }));

      const myV =
        myVideo &&
        (await prisma.myVideos.create({
          data: {
            ...myVideo,
            resumeId: resumes.id,
          },
        }));

      const heV =
        helperVideo &&
        (await prisma.helperVideos.create({
          data: {
            ...helperVideo,
            resumeId: resumes.id,
          },
        }));

      return {
        resume: resumes,
        resumeInfo: resumeInfos,
        educations: ed,
        careers: ca,
        activities: ac,
        trainings: tr,
        certificates: ce,
        awards: aw,
        portfolio: po || null,
        introductions: intro,
        myVideo: myV,
        helperVideo: heV || null,
        preference:
          {
            id: pref!.id,
            employType: pref!.employType || null,
            salary: pref!.salary || null,
            resumeId: pref!.resumeId,
            preferenceJobs: prefJobs,
            preferenceLocations: prefLocs,
          } || null,
      };
    });
  }

  async findPublicResumes({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }): Promise<Resumes[]> {
    return await this.prisma.resumes.findMany({
      where: { id: { gte: start }, isPublic: true },
      orderBy: { id: "asc" },
      take: limit,
    });
  }

  async findMyResumes(id: number): Promise<Resumes[]> {
    return await this.prisma.resumes.findMany({
      where: { userId: id },
      take: 10,
    });
  }

  async findResumeById(resumeId: number) {
    return await this.prisma.resumes.findUnique({
      where: { id: resumeId },
      include: {
        resumeInfos: true,
        careers: true,
        educations: true,
        activities: true,
        trainings: true,
        certificates: true,
        awards: true,
        portfolios: true,
        introductions: true,
        myVideos: true,
        helperVideos: true,
        preferences: {
          include: { preferenceJobs: true, preferenceLocation: true },
        },
      },
    });
  }

  async updateResume(id: number, { resume }: IUpdateResume) {
    return await this.prisma.resumes.update({
      where: { id },
      data: { ...resume },
    });
  }

  async updateResumeInfo(id: number, { resumeInfo }: UpdateResumeInfoDto) {
    return await this.prisma.resumeInfos.update({
      where: { id },
      data: { ...resumeInfo },
    });
  }

  async updateEducation(id: number, { education }: UpdateEducationDto) {
    return await this.prisma.educations.update({
      where: { id },
      data: { ...education },
    });
  }

  async createEducation(resumeId: number, data: EducationDto) {
    return await this.prisma.educations.create({ data: { resumeId, ...data } });
  }

  async updateCareer(id: number, { career }: UpdateCareerDto) {
    return await this.prisma.careers.update({
      where: { id },
      data: { ...career },
    });
  }

  async createCareer(resumeId: number, data: CareerDto) {
    return await this.prisma.careers.create({ data: { resumeId, ...data } });
  }

  async updateActivity(id: number, { activity }: UpdateActivityDto) {
    return await this.prisma.activities.update({
      where: { id },
      data: { ...activity },
    });
  }

  async createActivity(resumeId: number, data: ActivityDto) {
    return await this.prisma.activities.create({ data: { resumeId, ...data } });
  }

  async updateAward(id: number, { award }: UpdateAwardDto) {
    return await this.prisma.awards.update({
      where: { id },
      data: { ...award },
    });
  }

  async createAward(resumeId: number, data: AwardDto) {
    return await this.prisma.awards.create({ data: { resumeId, ...data } });
  }

  async updateMyVideo(id: number, { myVideo }: UpdateMyVideoDto) {
    return await this.prisma.myVideos.update({
      where: { id },
      data: { ...myVideo },
    });
  }

  async createMyVideo(resumeId: number, data: MyVideoDto) {
    return await this.prisma.myVideos.create({ data: { resumeId, ...data } });
  }

  async updateHelperVideo(id: number, { helperVideo }: UpdateHelperVideoDto) {
    return await this.prisma.helperVideos.update({
      where: { id },
      data: { ...helperVideo },
    });
  }

  async createHelperVideo(resumeId: number, data: HelperVideoDto) {
    return await this.prisma.helperVideos.create({
      data: { resumeId, ...data },
    });
  }

  async updatePreference(id: number, { preference }: UpdatePreferenceDto) {
    return await this.prisma.preferences.update({
      where: { id },
      data: { ...preference },
    });
  }

  async createPreference(
    resumeId: number,
    { preferenceJobs, preferenceLocations, ...rest }: PreferenceDto
  ) {
    return await this.prisma.preferences.create({
      data: {
        resumeId,
        ...rest,
        ...(preferenceJobs?.length && {
          preferenceJob: { create: preferenceJobs },
        }),
        ...(preferenceLocations?.length && {
          preferenceLocation: { create: preferenceLocations },
        }),
      },
      include: {
        preferenceJobs: true,
        preferenceLocation: true,
      },
    });
  }

  async updatePreferenceLocation(
    id: number,
    { preferenceLocation }: UpdatePreferenceLocationDto
  ) {
    return await this.prisma.preferenceLocations.update({
      where: { id },
      data: { ...preferenceLocation },
    });
  }

  async createPreferenceLocation(
    preferenceId: number,
    data: PreferenceLocationDto
  ) {
    return await this.prisma.preferenceLocations.create({
      data: { preferenceId, ...data },
    });
  }

  async updatePreferenceJob(
    id: number,
    { preferenceJob }: UpdatePreferenceJobDto
  ) {
    return await this.prisma.preferenceJobs.update({
      where: { id },
      data: { ...preferenceJob },
    });
  }

  async createPreferenceJob(preferenceId: number, data: PreferenceJobDto) {
    return await this.prisma.preferenceJobs.create({
      data: { preferenceId, ...data },
    });
  }

  async deleteResume(id: number) {
    return await this.prisma.resumes.delete({ where: { id } });
  }

  async deleteResumeInfo(id: number) {
    return await this.prisma.resumeInfos.delete({ where: { id } });
  }

  async deleteEducation(id: number) {
    return await this.prisma.educations.delete({ where: { id } });
  }

  async deleteCareer(id: number) {
    return await this.prisma.careers.delete({ where: { id } });
  }

  async deleteActivity(id: number) {
    return await this.prisma.activities.delete({ where: { id } });
  }

  async deleteAward(id: number) {
    return await this.prisma.awards.delete({ where: { id } });
  }

  async deleteMyVideo(id: number) {
    return await this.prisma.myVideos.delete({ where: { id } });
  }

  async deleteHelperVideo(id: number) {
    return await this.prisma.helperVideos.delete({ where: { id } });
  }

  async deletePreference(id: number) {
    return await this.prisma.preferences.delete({ where: { id } });
  }

  async deletePreferenceJob(id: number) {
    return await this.prisma.preferenceJobs.delete({ where: { id } });
  }

  async deletePreferenceLocation(id: number) {
    return await this.prisma.preferenceLocations.delete({ where: { id } });
  }
}
