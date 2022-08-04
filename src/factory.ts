/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import {
  Activities,
  Awards,
  Careers,
  Certificates,
  Educations,
  HelperVideos,
  Introductions,
  MyVideos,
  Portfolios,
  PreferenceJobs,
  PreferenceLocations,
  Preferences,
  Prisma,
  ResumeInfos,
  Resumes,
  Trainings,
} from "@prisma/client";
import { CreateJobDescriptionDto } from "./dtos";
import { ICreateResume } from "./types";

export const newResumeAllFactory = ({
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
}: Partial<ICreateResume> = {}): ICreateResume => {
  return {
    resume: resume || newResumeFactory(),
    resumeInfo: resumeInfo || newResumeInfoFactory(),
    educations: educations || [newEducationFactory()],
    careers: careers || [newCareerFactory()],
    activities: activities || [newActivityFactory()],
    trainings: trainings || [newTrainingFactory()],
    certificates: certificates || [newCertificateFactory()],
    awards: awards || [newAwardFactory()],
    portfolio: portfolio || newPortfolioFactory(),
    introductions: introductions || [newIntroductionFactory()],
    myVideo: myVideo || newMyVideoFactory(),
    helperVideo: helperVideo || newHelperVideoFactory(),
    preference: preference || {
      ...newPreferenceFactory(),
      preferenceJobs: [newPreferenceJobFactory()],
      preferenceLocations: [newPreferenceLocationFactory()],
    },
  };
};

export const newResumeFactory = ({
  title,
  content,
  isPublic,
  createdAt,
  updatedAt,
}: Partial<Omit<Resumes, "id" | "userId">> = {}): Omit<
  Resumes,
  "id" | "userId"
> => {
  return {
    title: title || "이력서제목1",
    content: content || "이력서제목1",
    isPublic: isPublic || true,
    createdAt: createdAt || new Date(),
    updatedAt: updatedAt || new Date(),
  };
};

export const newResumeInfoFactory = ({
  name,
  birthday,
  phoneNumber,
  email,
  sido,
  sigungu,
  disabilityLevel,
  disabilityType,
  sex,
  avatar,
}: Partial<Omit<ResumeInfos, "id" | "resumeId">> = {}): Omit<
  ResumeInfos,
  "id" | "resumeId"
> => {
  return {
    name: name || "이름",
    birthday: birthday || new Date(),
    phoneNumber: phoneNumber || "010-0000-0000",
    email: email || "ehgks@gmail.com",
    sido: sido || "김포시",
    sigungu: sigungu || "경기도",
    disabilityLevel: disabilityLevel || 1,
    disabilityType: disabilityType || "간 장애",
    sex: sex || "남",
    avatar: avatar || "avatar",
  };
};

export const newEducationFactory = ({
  type,
  schoolName,
  graduationYear,
  admissionYear,
  isGraduated,
  major,
  credit,
  totalCredit,
}: Partial<Omit<Educations, "id" | "resumeId">> = {}): Omit<
  Educations,
  "id" | "resumeId"
> => {
  return {
    type: type || "",
    schoolName: schoolName || "학교이름",
    graduationYear: graduationYear || new Date(),
    admissionYear: admissionYear || new Date(),
    isGraduated: isGraduated || true,
    major: major || "전공",
    credit: credit || new Prisma.Decimal(4.5),
    totalCredit: totalCredit || new Prisma.Decimal(4.5),
  };
};

export const newCareerFactory = ({
  company,
  department,
  position,
  task,
  joinedAt,
  quitedAt,
  isInOffice,
}: Partial<Omit<Careers, "id" | "resumeId">> = {}): Omit<
  Careers,
  "id" | "resumeId"
> => {
  return {
    company: company || "회사이름",
    department: department || "부서이름",
    position: position || "직무",
    task: task || "업무이름",
    quitedAt: quitedAt || new Date(),
    isInOffice: isInOffice || true,
    joinedAt: joinedAt || new Date(),
  };
};

export const newActivityFactory = ({
  organization,
  description,
}: Partial<Omit<Activities, "id" | "resumeId">> = {}): Omit<
  Activities,
  "id" | "resumeId"
> => {
  return {
    organization: organization || "단체이름",
    description: description || "설명",
  };
};

export const newTrainingFactory = ({
  name,
  institute,
  content,
  startedAt,
  finishedAt,
}: Partial<Omit<Trainings, "id" | "resumeId">> = {}): Omit<
  Trainings,
  "id" | "resumeId"
> => {
  return {
    name: name || "교육이수1",
    institute: institute || "교육이수 기관1",
    content: content || "교육내용",
    startedAt: startedAt || new Date(),
    finishedAt: finishedAt || new Date(),
  };
};

export const newCertificateFactory = ({
  name,
  institute,
  acquisitionAt,
}: Partial<Omit<Certificates, "id" | "resumeId">> = {}): Omit<
  Certificates,
  "id" | "resumeId"
> => {
  return {
    name: name || "자격증1",
    institute: institute || "자격증 인증 기관",
    acquisitionAt: acquisitionAt || new Date(),
  };
};

export const newAwardFactory = ({
  institute,
  startedAt,
  finishedAt,
  name,
}: Partial<Omit<Awards, "id" | "resumeId">> = {}): Omit<
  Awards,
  "id" | "resumeId"
> => {
  return {
    name: name || "무슨무슨상",
    institute: institute || "학회이름",
    startedAt: startedAt || new Date(),
    finishedAt: finishedAt || new Date(),
  };
};

export const newPortfolioFactory = ({
  url,
}: Partial<Omit<Portfolios, "id" | "resumeId">> = {}): Omit<
  Portfolios,
  "id" | "resumeId"
> => {
  return {
    url: url || "포트폴리오url",
  };
};

export const newIntroductionFactory = ({
  title,
  content,
}: Partial<Omit<Introductions, "id" | "resumeId">> = {}): Omit<
  Introductions,
  "id" | "resumeId"
> => {
  return {
    title: title || "포트폴리오url",
    content: content || "나는content입니다.",
  };
};

export const newMyVideoFactory = ({
  url,
}: Partial<Omit<MyVideos, "id" | "resumeId">> = {}): Omit<
  MyVideos,
  "id" | "resumeId"
> => {
  return {
    url: url || "my-video-url",
  };
};

export const newHelperVideoFactory = ({
  url,
}: Partial<Omit<HelperVideos, "id" | "resumeId">> = {}): Omit<
  HelperVideos,
  "id" | "resumeId"
> => {
  return {
    url: url || "my-video-url",
  };
};

export const newPreferenceFactory = ({
  employType,
  salary,
}: Partial<Omit<Preferences, "id" | "resumeId">> = {}): Omit<
  Preferences,
  "id" | "resumeId"
> => {
  return {
    employType: employType || "1",
    salary: salary || 6000,
  };
};

export const newPreferenceJobFactory = ({
  name,
}: Partial<Omit<PreferenceJobs, "id" | "preferenceId">> = {}): Omit<
  PreferenceJobs,
  "id" | "preferenceId"
> => {
  return {
    name: name || "선호 직업 이름",
  };
};

export const newPreferenceLocationFactory = ({
  sido,
  sigungu,
}: Partial<Omit<PreferenceLocations, "id" | "preferenceId">> = {}): Omit<
  PreferenceLocations,
  "id" | "preferenceId"
> => {
  return {
    sido: sido || "부산시",
    sigungu: sigungu || "경상남도",
  };
};

export const newCompanyJobDescriptionFactory = (): CreateJobDescriptionDto => {
  const now = new Date();
  const tomorrow = now.setDate(now.getDate() + 1);
  return {
    startedAt: now,
    deadlineAt: new Date(tomorrow),
    category: "카테고리",
    jdDetails: [
      {
        title: "제목",
        numRecruitment: 0,
        role: "개발자",
        requirements: "cs 전공지식",
        priority: "딥러닝",
      },
      {
        title: "제목2",
        numRecruitment: 10,
        role: "기획자",
        requirements: "기획상품",
        priority: "경력 3년",
      },
    ],
    jdWorkCondition: {
      type: "정규직(수습3개월)",
      time: "9 to 6",
      place: "서울시 강남구",
    },
    jdSteps: [
      { step: 1, title: "서류제출" },
      { step: 2, title: "코테" },
    ],
    jdWelfares: [{ title: "커피무제한", content: "우리 회사 커피는 무제한~" }],
  };
};
