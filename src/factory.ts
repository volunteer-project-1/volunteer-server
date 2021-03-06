/* eslint-disable camelcase */
import { CreateJobDescriptionDto } from "./dtos";
import {
  IActivity,
  IAward,
  ICareers,
  ICreateResume,
  IEducation,
  IHelperVideo,
  IMyVideo,
  IPreference,
  IPreferenceJob,
  IPreferenceLocation,
  IResumeInfo,
} from "./types";
import { convertDateToTimestamp } from "./utils";

export const newResumeFactory = ({
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
    resume: resume || { title: "제목", content: "내용", is_public: true },
    resumeInfo: resumeInfo || {
      name: "김도한",
      birthday: convertDateToTimestamp(),
      phone_number: "010-1234-5678",
      email: "ehgks0083@gmail.com",
      sido: "서울시",
      sigungu: "강서구",
      disability_level: 1,
      disability_type: "호흡기 장애",
      sex: "남",
      avatar: "http://thisis.avatar.url.com",
    },
    educations: educations || [
      {
        type: "고등학교",
        school_name: "무슨고",
        graduation_year: convertDateToTimestamp(),
        admission_year: convertDateToTimestamp(),
        is_graduated: true,
        major: "이과",
        credit: 4.5,
        total_credit: 4.5,
      },
    ],
    careers: careers || [
      {
        company: "회사",
        department: "부서",
        position: "직무",
        task: "업무",
        joined_at: convertDateToTimestamp(),
      },
    ],
    activities: activities || [{ organization: "조직", description: "설명" }],
    trainings: trainings || [
      {
        name: "교육이수1",
        institute: "교육이수 기관1",
        content: "교육내용",
        started_at: convertDateToTimestamp(),
        finished_at: convertDateToTimestamp(),
      },
    ],
    certificates: certificates || [
      {
        name: "자격증1",
        institute: "자격증 인증 기관",
        acquisition_at: convertDateToTimestamp(),
      },
    ],
    awards: awards || [
      {
        institute: "학회",
        started_at: convertDateToTimestamp(),
        finished_at: convertDateToTimestamp(),
      },
    ],
    portfolio: portfolio || { url: "포트폴리오 링크" },
    introductions: introductions || [
      { title: "왜 이 직무를 선택했나요?", content: "좋아서 했습니다" },
    ],
    myVideo: myVideo || { url: "내영상링크" },
    helperVideo: helperVideo || { url: "헬퍼영상링크" },
    preference: preference || {
      employ_type: 1,
      salary: 4000,
      preferenceJobs: [{ name: "직업선호" }],
      preferenceLocations: [{ sido: "서울시", sigungu: "강서구" }],
    },
  };
};

export const newResumeInfoFactory = ({
  name,
  birthday,
  phone_number,
  email,
  sido,
  sigungu,
  disability_level,
  disability_type,
  sex,
}: Partial<
  Omit<IResumeInfo, "id" | "resume_id">
> = {}): Partial<IResumeInfo> => {
  return {
    name: name || "이름",
    birthday: birthday || convertDateToTimestamp(),
    phone_number: phone_number || "010-0000-0000",
    email: email || "ehgks@gmail.com",
    sido: sido || "김포시",
    sigungu: sigungu || "경기도",
    disability_level: disability_level || 1,
    disability_type: disability_type || "간 장애",
    sex: sex || "남",
  };
};

export const newEducationFactory = ({
  type,
  school_name,
  graduation_year,
  admission_year,
  is_graduated,
  major,
  credit,
  total_credit,
}: Partial<Omit<IEducation, "id" | "resume_id">> = {}): Partial<IEducation> => {
  return {
    type: type || "",
    school_name: school_name || "학교이름",
    graduation_year: graduation_year || convertDateToTimestamp(),
    admission_year: admission_year || convertDateToTimestamp(),
    is_graduated: is_graduated || true,
    major: major || "전공",
    credit: credit || 4.5,
    total_credit: total_credit || 4.5,
  };
};

export const newCareerFactory = ({
  company,
  department,
  position,
  task,
  joined_at,
}: Partial<Omit<ICareers, "id" | "resume_id">> = {}): Partial<ICareers> => {
  return {
    company: company || "회사이름",
    department: department || "부서이름",
    position: position || "직무",
    task: task || "업무이름",
    joined_at: joined_at || convertDateToTimestamp(),
  };
};

export const newActivityFactory = ({
  organization,
  description,
}: Partial<Omit<IActivity, "id" | "resume_id">> = {}): Partial<IActivity> => {
  return {
    organization: organization || "단체이름",
    description: description || "설명",
  };
};

export const newAwardFactory = ({
  institute,
  started_at,
  finished_at,
}: Partial<Omit<IAward, "id" | "resume_id">> = {}): Partial<IAward> => {
  return {
    institute: institute || "학회이름",
    started_at: started_at || convertDateToTimestamp(),
    finished_at: finished_at || convertDateToTimestamp(),
  };
};

export const newMyVideoFactory = ({
  url,
}: Partial<Omit<IMyVideo, "id" | "resume_id">> = {}): Partial<IMyVideo> => {
  return {
    url: url || "my-video-url",
  };
};

export const newHelperVideoFactory = ({
  url,
}: Partial<
  Omit<IHelperVideo, "id" | "resume_id">
> = {}): Partial<IHelperVideo> => {
  return {
    url: url || "my-video-url",
  };
};

export const newPreferenceFactory = ({
  employ_type,
  salary,
}: Partial<
  Omit<IPreference, "id" | "resume_id">
> = {}): Partial<IPreference> => {
  return {
    employ_type: employ_type || 1,
    salary: salary || 6000,
  };
};

export const newPreferenceJobFactory = ({
  name,
}: Partial<
  Omit<IPreferenceJob, "id" | "preference_id">
> = {}): Partial<IPreferenceJob> => {
  return {
    name: name || "선호 직업 이름",
  };
};

export const newPreferenceLocationFactory = ({
  sido,
  sigungu,
}: Partial<
  Omit<IPreferenceLocation, "id" | "preference_id">
> = {}): Partial<IPreferenceLocation> => {
  return {
    sido: sido || "부산시",
    sigungu: sigungu || "경상남도",
  };
};

export const newCompanyJobDescriptionFactory = (): CreateJobDescriptionDto => {
  const now = new Date();
  const tomorrow = now.setDate(now.getDate() + 1);
  return {
    started_at: convertDateToTimestamp(now),
    deadline_at: convertDateToTimestamp(new Date(tomorrow)),
    category: "카테고리",
    jd_details: [
      {
        title: "제목",
        num_recruitment: 0,
        role: "개발자",
        requirements: "cs 전공지식",
        priority: "딥러닝",
      },
      {
        title: "제목2",
        num_recruitment: 10,
        role: "기획자",
        requirements: "기획상품",
        priority: "경력 3년",
      },
    ],
    jd_work_condition: {
      type: "정규직(수습3개월)",
      time: "9 to 6",
      place: "서울시 강남구",
    },
    jd_steps: [
      { step: 1, title: "서류제출" },
      { step: 2, title: "코테" },
    ],
    jd_welfares: [{ title: "커피무제한", content: "우리 회사 커피는 무제한~" }],
  };
};
