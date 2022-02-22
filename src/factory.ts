import { createResumeDTO } from "./types";

export const newResumeFactory = ({
  resume,
  resumeInfo,
  educations,
  careers,
  activities,
  awards,
  myVideo,
  helperVideo,
  preference,
}: Partial<createResumeDTO> = {}): createResumeDTO => {
  return {
    resume: resume || { title: "제목", content: "내용" },
    resumeInfo: resumeInfo || {
      name: "김도한",
      birthday: new Date(),
      phone_number: "010-1234-5678",
      email: "ehgks0083@gmail.com",
      sido: "서울시",
      sigungu: "강서구",
      disability_level: 1,
      disability_type: "호흡기 장애",
      sex: "남",
    },
    educations: educations || [
      {
        type: "고등학교",
        school_name: "무슨고",
        graduation_year: new Date(),
        admission_year: new Date(),
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
        joined_at: new Date(),
      },
    ],
    activities: activities || [{ organization: "조직", description: "설명" }],
    awards: awards || [
      { institute: "학회", started_at: new Date(), finished_at: new Date() },
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
