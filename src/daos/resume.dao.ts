import { Service } from "typedi";
import { createResumeDTO, IResumeDAO } from "../types";
import { insert, MySQL, queryTransactionWrapper } from "../utils";

const RESUME_TABLE = "resumes";
const RESUME_INFO_TABLE = "resume_infos";
const EDUCATION_TABLE = "educations";
const CAREER_TABLE = "careers";
const ACTIVITY_TABLE = "activities";
const AWARD_TABLE = "awards";
const MY_VIDEO_TABLE = "my_videos";
const HELPER_VIDEO_TABLE = "helper_videos";
const PREFERNCE_TABLE = "preferences";
const PREFERNCE_JOB_TABLE = "preference_jobs";
const PREFERNCE_LOCATION_TABLE = "preference_locations";
const USER_META_TABLE = "user_metas";

@Service()
export class ResumeDAO implements IResumeDAO {
  constructor(private readonly mysql: MySQL) {}

  async createResume(
    userId: number,
    {
      resume,
      resumeInfo,
      educations,
      careers,
      activities,
      awards,
      myVideo,
      helperVideo,
      preference: { preferenceJobs, preferenceLocations, ...preference },
    }: createResumeDTO
  ) {
    const conn = await this.mysql.getConnection();

    const LAST_RESUME_ID = "@last_resume_id";
    const LAST_PREFERENCE_ID = "@last_preference_id";

    const resumeField = Object.keys(resume).concat("user_id");
    const resumeQuery = `INSERT INTO ${RESUME_TABLE} (${resumeField}) VALUES (?)`;

    const resumeQueryFunction = insert(
      {
        query: resumeQuery,
        values: [Object.values<any>(resume).concat(userId)],
      },
      conn
    );

    const setLastResumeIdQueryFunction = insert(
      {
        query: `SET ${LAST_RESUME_ID} = Last_insert_id();`,
      },
      conn
    );

    const resumeInfoFieldNames = Object.keys(resumeInfo).concat("resume_id");
    const resumeInfosQuery = `INSERT INTO ${RESUME_INFO_TABLE} (${resumeInfoFieldNames}) VALUES (?, ${LAST_RESUME_ID});`;
    const resumeValues = [Object.values<any>(resumeInfo)];

    const resumeInfoQueryFunction = insert(
      { query: resumeInfosQuery, values: resumeValues },
      conn
    );

    const educationQueryFunctions = educations.map((education) => {
      const educationFieldNames = Object.keys(education).concat("resume_id");
      const educationQuery = `INSERT INTO ${EDUCATION_TABLE} (${educationFieldNames}) VALUES (?, ${LAST_RESUME_ID});`;

      return insert(
        {
          query: educationQuery,
          values: [Object.values<any>(education)],
        },
        conn
      );
    });

    const carrerQueryFunctions = careers.map((career) => {
      const carrerFieldNames = Object.keys(career).concat("resume_id");
      const carrerQuery = `INSERT INTO ${CAREER_TABLE} (${carrerFieldNames}) VALUES (?, ${LAST_RESUME_ID})`;

      return insert(
        { query: carrerQuery, values: [Object.values(career)] },
        conn
      );
    });

    const activityQueryFunctions = activities.map((activity) => {
      const activityFieldNames = Object.keys(activity).concat("resume_id");
      const activityQuery = `INSERT INTO ${ACTIVITY_TABLE} (${activityFieldNames}) VALUES (?, ${LAST_RESUME_ID})`;

      return insert(
        {
          query: activityQuery,
          values: [Object.values(activity)],
        },
        conn
      );
    });

    const awardQueryFunctions = awards.map((award) => {
      const awardFieldNames = Object.keys(award).concat("resume_id");
      const awardQuery = `INSERT INTO ${AWARD_TABLE} (${awardFieldNames}) VALUES (?, ${LAST_RESUME_ID})`;

      return insert(
        { query: awardQuery, values: [Object.values(award)] },
        conn
      );
    });

    const myVideoFieldNames = Object.keys(myVideo).concat("resume_id");
    const myVideoQuery = `INSERT INTO ${MY_VIDEO_TABLE} (${myVideoFieldNames}) VALUES (?, ${LAST_RESUME_ID})`;
    const myVideoQueryFunction = insert(
      { query: myVideoQuery, values: [Object.values(myVideo)] },
      conn
    );

    const helperVideoFieldNames = Object.keys(helperVideo).concat("resume_id");
    const helperVideoQuery = `INSERT INTO ${HELPER_VIDEO_TABLE} (${helperVideoFieldNames}) VALUES (?, ${LAST_RESUME_ID})`;
    const helperVideoQueryFunction = insert(
      { query: helperVideoQuery, values: [Object.values(helperVideo)] },
      conn
    );

    const preferenceFieldNames = Object.keys(preference).concat("resume_id");
    const preferenceQuery = `INSERT INTO ${PREFERNCE_TABLE} (${preferenceFieldNames}) VALUES (?, ${LAST_RESUME_ID})`;
    const preferenceQueryFunction = insert(
      { query: preferenceQuery, values: [Object.values(preference)] },
      conn
    );

    const setLastPreferenceIdQueryFunction = insert(
      {
        query: `SET ${LAST_PREFERENCE_ID} = Last_insert_id();`,
      },
      conn
    );

    const preferenceJobQueryFunctions = preferenceJobs.map((preferenceJob) => {
      const preferenceJobFieldNames =
        Object.keys(preferenceJob).concat("preference_id");
      const preferenceJobQuery = `INSERT INTO ${PREFERNCE_JOB_TABLE} (${preferenceJobFieldNames}) VALUES (?, ${LAST_PREFERENCE_ID})`;
      return insert(
        { query: preferenceJobQuery, values: [Object.values(preferenceJob)] },
        conn
      );
    });

    const preferenceLocationQueryFunctions = preferenceLocations.map(
      (preferenceLocation) => {
        const preferenceLocationFieldNames =
          Object.keys(preferenceLocation).concat("preference_id");
        const preferenceLocationQuery = `INSERT INTO ${PREFERNCE_LOCATION_TABLE} (${preferenceLocationFieldNames}) VALUES (?, ${LAST_PREFERENCE_ID})`;
        return insert(
          {
            query: preferenceLocationQuery,
            values: [Object.values(preferenceLocation)],
          },
          conn
        );
      }
    );

    const updateUserMetaQueryFunction = insert(
      {
        query: `
        UPDATE ${USER_META_TABLE} AS m
        SET m.is_verified = IF( m.is_verified=0, 1, m.is_verified)
        WHERE m.user_id = ?;`,
        values: [userId],
      },
      conn
    );

    await queryTransactionWrapper(
      [
        resumeQueryFunction,
        setLastResumeIdQueryFunction,
        resumeInfoQueryFunction,
        ...educationQueryFunctions,
        ...carrerQueryFunctions,
        ...activityQueryFunctions,
        ...awardQueryFunctions,
        myVideoQueryFunction,
        helperVideoQueryFunction,
        preferenceQueryFunction,
        setLastPreferenceIdQueryFunction,
        ...preferenceJobQueryFunctions,
        ...preferenceLocationQueryFunctions,
        updateUserMetaQueryFunction,
      ],
      conn
    );
  }
}
