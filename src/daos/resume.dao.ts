import { Service } from "typedi";
import { createResumeDTO, findResumeDTO, IResumeDAO } from "../types";
import {
  find,
  insert,
  MySQL,
  QueryFunction,
  queryTransactionWrapper,
  update,
} from "../utils";

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

  async findResumeById(resumeId: number) {
    const conn = await this.mysql.getConnection();

    const subQuery1 = `
    SELECT resume_id, json_object('name', RI.name, 'birthday', RI.birthday, 'phone_number', RI.phone_number, 'email', RI.email, 'sido', RI.sido, 'sigungu', RI.sigungu, 'disability_level', RI.disability_level, 'disability_type', RI.disability_type, 'sex', RI.sex) AS resume_info
    FROM ${RESUME_INFO_TABLE} AS RI
    GROUP BY resume_id`;

    const subQuery2 = `
    SELECT resume_id, json_arrayagg(json_object('company', C.company, 'department', C.department)) AS careers
    FROM ${CAREER_TABLE} AS C
    GROUP BY resume_id`;

    const subQuery3 = `
    SELECT resume_id, json_arrayagg(json_object('type', E.type, 'school_name', E.school_name)) AS educations
    FROM ${EDUCATION_TABLE} AS E
    GROUP BY resume_id`;

    const subQuery4 = `
    SELECT resume_id, json_arrayagg(json_object('organization', A.organization, 'description', A.description)) AS activities
    FROM ${ACTIVITY_TABLE} AS A
    GROUP BY resume_id`;

    const subQuery5 = `
    SELECT resume_id, json_arrayagg(json_object('institute', W.institute, 'started_at', W.started_at)) AS awards
    FROM ${AWARD_TABLE} AS W
    GROUP BY resume_id`;

    const subQuery6 = `
    SELECT resume_id, json_object('url', MY.url) AS my_video
    FROM ${MY_VIDEO_TABLE} AS MY
    GROUP BY resume_id`;

    const subQuery7 = `
    SELECT resume_id, json_object('url', H.url) AS helper_video
    FROM ${HELPER_VIDEO_TABLE} AS H
    GROUP BY resume_id`;

    const subsubQuery1 = `
    SELECT preference_id, json_arrayagg(json_object('name', PJ.name)) AS preference_jobs
    FROM ${PREFERNCE_JOB_TABLE} AS PJ
    GROUP BY preference_id`;

    const subsubQuery2 = `
    SELECT preference_id, json_arrayagg(json_object('sido', PL.sido, 'sigungu', PL.sigungu)) AS preference_locations
    FROM ${PREFERNCE_LOCATION_TABLE} AS PL
    GROUP BY preference_id`;

    const subQuery8 = `
    SELECT id, resume_id, json_object('employ_type', P.employ_type, 'salary', P.salary, 'preference_jobs', pj.preference_jobs, 'preference_locations', pl.preference_locations) AS preference
    FROM ${PREFERNCE_TABLE} AS P
        JOIN (${subsubQuery1}) AS pj ON pj.preference_id = P.id
        JOIN (${subsubQuery2}) AS pl ON pl.preference_id = P.id
    GROUP BY resume_id`;

    const query = `
        SELECT
            R.title,
            R.content,
            ri.resume_info,
            e.educations,
            c.careers,
            a.activities,
            w.awards,
            my.my_video,
            h.helper_video,
            p.preference
        FROM ${RESUME_TABLE} AS R
        JOIN (${subQuery1}) AS ri ON ri.resume_id = R.id
        JOIN (${subQuery2}) AS c ON c.resume_id = R.id
        JOIN (${subQuery3}) AS e ON e.resume_id = R.id
        JOIN (${subQuery4}) AS a ON a.resume_id = R.id
        JOIN (${subQuery5}) AS w ON w.resume_id = R.id
        JOIN (${subQuery6}) AS my ON my.resume_id = R.id
        JOIN (${subQuery7}) AS h ON h.resume_id = R.id
        JOIN (${subQuery8}) AS p ON p.resume_id = R.id
        WHERE R.id = ?;
    `;
    const findResumeQueryFunction = find({ query, values: [resumeId] }, conn);

    const results = await queryTransactionWrapper<findResumeDTO>(
      [findResumeQueryFunction],
      conn
    );
    if (!results) {
      throw new Error("Resume Notfound");
    }
    const [[[row]]] = results;

    return row;
  }

  async updateResume(
    resumeId: number,
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
    const queryFunctions: QueryFunction[] = [];

    // const setUpdatedResumeQuery = `
    // SET @updated_resume_id := 0;
    // `;

    // const setUpdateResumeIdQueryFunction = insert(
    //   { query: setUpdatedResumeQuery },
    //   conn
    // );

    // SET ?, id = (SELECT @updated_resume_id := id)

    if (resume) {
      const updateResumeQuery = `
    UPDATE ${RESUME_TABLE}
    SET ?
    WHERE id = ?
    LIMIT 1;
    `;
      const updateResumeQueryFunction = update(
        { query: updateResumeQuery, values: [resume, resumeId] },
        conn
      );
      queryFunctions.push(updateResumeQueryFunction);
    }

    // TODO 각자 항목 수정하기 위해 함수로 분리해야함

    if (resumeInfo) {
      const updateResumeInfoQuery = `
        UPDATE ${RESUME_INFO_TABLE}
        SET ?
        WHERE resume_id = ?
        LIMIT 1;
    `;
      const updateResumeInfoQueryFunction = update(
        { query: updateResumeInfoQuery, values: [resumeInfo, resumeId] },
        conn
      );
      queryFunctions.push(updateResumeInfoQueryFunction);
    }

    if (educations) {
      educations.forEach((education) => {
        const query = `
              UPDATE ${RESUME_INFO_TABLE}
              SET ?
              WHERE resume_id = ?
              LIMIT 1;
              `;

        queryFunctions.push(
          update({ query, values: [education, resumeId] }, conn)
        );
      });
    }

    if (careers) {
      careers.forEach((career) => {
        const query = `
              UPDATE ${CAREER_TABLE}
              SET ?
              WHERE resume_id = ?
              LIMIT 1;
              `;
        queryFunctions.push(
          update({ query, values: [career, resumeId] }, conn)
        );
      });
    }
    if (activities) {
      activities.forEach((activity) => {
        const query = `
              UPDATE ${ACTIVITY_TABLE}
              SET ?
              WHERE resume_id = ?
              LIMIT 1;
              `;
        queryFunctions.push(
          update({ query, values: [activity, resumeId] }, conn)
        );
      });
    }
    if (awards) {
      awards.forEach((award) => {
        const query = `
              UPDATE ${AWARD_TABLE}
              SET ?
              WHERE resume_id = ?
              LIMIT 1;
              `;
        queryFunctions.push(update({ query, values: [award, resumeId] }, conn));
      });
    }

    if (myVideo) {
      const query = `
              UPDATE ${MY_VIDEO_TABLE}
              SET ?
              WHERE resume_id = ?
              LIMIT 1;
              `;
      queryFunctions.push(update({ query, values: [myVideo, resumeId] }, conn));
    }

    if (helperVideo) {
      const query = `
              UPDATE ${HELPER_VIDEO_TABLE}
              SET ?
              WHERE resume_id = ?
              LIMIT 1;
              `;
      queryFunctions.push(
        update({ query, values: [helperVideo, resumeId] }, conn)
      );
    }
    const LAST_UPDATE_PREFERENCE_ID = "@last_update_id";
    if (preference) {
      const getLastUpdatedPreferenceIdQuery = `
      SET ${LAST_UPDATE_PREFERENCE_ID} := 0;
      `;

      const getUpdatePreferenceIdQueryFunction = insert(
        { query: getLastUpdatedPreferenceIdQuery },
        conn
      );

      const query = `
              UPDATE ${PREFERNCE_TABLE}
              SET ?, id = (SELECT ${LAST_UPDATE_PREFERENCE_ID} := id)
              WHERE resume_id = ?
              LIMIT 1;
              `;
      queryFunctions.push(
        getUpdatePreferenceIdQueryFunction,
        update({ query, values: [preference, resumeId] }, conn)
      );
    }

    // if (preferenceLocations) {
    //   preferenceLocations.forEach();
    // }

    await queryTransactionWrapper(queryFunctions, conn);
  }
}
