import { Service } from "typedi";
import { OkPacket } from "mysql2/promise";
import { queryTransactionWrapper } from "../utils";
import { MySQL, findOneOrWhole, insert, update } from "../db";
import {
  ICreateResume,
  IFindResume,
  IFindWholeResume,
  IResumeDAO,
  IUpdateResume,
} from "../types";
import {
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
import {
  RESUME_TABLE,
  RESUME_INFO_TABLE,
  EDUCATION_TABLE,
  CAREER_TABLE,
  ACTIVITY_TABLE,
  AWARD_TABLE,
  MY_VIDEO_TABLE,
  HELPER_VIDEO_TABLE,
  PREFERNCE_TABLE,
  PREFERNCE_JOB_TABLE,
  PREFERNCE_LOCATION_TABLE,
  USER_METAS_TABLE,
  TRAINING_TABLE,
  PORTFOLIO_TABLE,
} from "../constants";

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
      trainings,
      certificates,
      awards,
      portfolio,
      myVideo,
      helperVideo,
      preference: { preferenceJobs, preferenceLocations, ...preference },
    }: ICreateResume
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

    const trainingQueryFunctions = trainings.map((training) => {
      const trainingFieldNames = Object.keys(training).concat("resume_id");
      const trainingQuery = `INSERT INTO ${TRAINING_TABLE} (${trainingFieldNames}) VALUES (?, ${LAST_RESUME_ID})`;

      return insert(
        {
          query: trainingQuery,
          values: [Object.values(training)],
        },
        conn
      );
    });

    const certificateQueryFunctions = certificates.map((certificate) => {
      const certificateFieldNames =
        Object.keys(certificate).concat("resume_id");
      const certificateQuery = `INSERT INTO ${TRAINING_TABLE} (${certificateFieldNames}) VALUES (?, ${LAST_RESUME_ID})`;

      return insert(
        {
          query: certificateQuery,
          values: [Object.values(certificate)],
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

    const portfolioFieldNames = Object.keys(portfolio).concat("resume_id");
    const portfolioQuery = `INSERT INTO ${PORTFOLIO_TABLE} (${portfolioFieldNames}) VALUES (?, ${LAST_RESUME_ID})`;
    const portfolioFunction = insert(
      {
        query: portfolioQuery,
        values: [Object.values(portfolioFieldNames)],
      },
      conn
    );

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
        UPDATE ${USER_METAS_TABLE} AS m
        SET m.is_verified = IF( m.is_verified=0, 1, m.is_verified)
        WHERE m.user_id = ?;`,
        values: [userId],
      },
      conn
    );

    const results = await queryTransactionWrapper(
      [
        resumeQueryFunction,
        setLastResumeIdQueryFunction,
        resumeInfoQueryFunction,
        ...educationQueryFunctions,
        ...carrerQueryFunctions,
        ...activityQueryFunctions,
        ...trainingQueryFunctions,
        ...certificateQueryFunctions,
        ...awardQueryFunctions,
        portfolioFunction,
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

    return {
      resume: results[0] as OkPacket,
    };
  }

  async findPublicResumes({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }): Promise<IFindResume[] | undefined> {
    const pool = this.mysql.getPool();
    const query = `
        SELECT * 
        FROM ${RESUME_TABLE} 
        WHERE id >= ? AND is_public = true ORDER BY id LIMIT ?`;

    const [rows] = await findOneOrWhole(
      { query, values: [start, limit] },
      pool
    )();

    if (rows.length === 0) {
      return undefined;
    }

    return rows as IFindResume[];
  }

  async findMyResumes(id: number): Promise<IFindResume[]> {
    const pool = this.mysql.getPool();

    const query = `SELECT * FROM ${RESUME_TABLE} WHERE user_id = ? LIMIT 10`;

    const [rows] = await findOneOrWhole({ query, values: [id] }, pool)();

    return rows as IFindResume[];
  }

  async findResumeById(resumeId: number): Promise<IFindWholeResume> {
    const pool = this.mysql.getPool();

    const subQuery1 = `
    SELECT resume_id, json_object('id', RI.id, 'name', RI.name, 'birthday', RI.birthday, 'phone_number', RI.phone_number, 'email', RI.email, 'sido', RI.sido, 'sigungu', RI.sigungu, 'disability_level', RI.disability_level, 'disability_type', RI.disability_type, 'sex', RI.sex) AS resume_info
    FROM ${RESUME_INFO_TABLE} AS RI
    WHERE resume_id = ?
    GROUP BY resume_id
    LIMIT 1
    `;

    const subQuery2 = `
    SELECT resume_id, json_arrayagg(json_object('id', C.id, 'company', C.company, 'department', C.department)) AS careers
    FROM ${CAREER_TABLE} AS C
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const subQuery3 = `
    SELECT resume_id, json_arrayagg(json_object('id', E.id, 'type', E.type, 'school_name', E.school_name)) AS educations
    FROM ${EDUCATION_TABLE} AS E
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const subQuery4 = `
    SELECT resume_id, json_arrayagg(json_object('id', A.id, 'organization', A.organization, 'description', A.description)) AS activities
    FROM ${ACTIVITY_TABLE} AS A
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const subQuery5 = `
    SELECT resume_id, json_arrayagg(json_object('id', W.id, 'institute', W.institute, 'started_at', W.started_at)) AS awards
    FROM ${AWARD_TABLE} AS W
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const subQuery6 = `
    SELECT resume_id, json_object('id', MY.id, 'url', MY.url) AS my_video
    FROM ${MY_VIDEO_TABLE} AS MY
    WHERE resume_id = ?
    GROUP BY resume_id
    LIMIT 1
    `;

    const subQuery7 = `
    SELECT resume_id, json_object('id', H.id, 'url', H.url) AS helper_video
    FROM ${HELPER_VIDEO_TABLE} AS H
    WHERE resume_id = ?
    GROUP BY resume_id
    LIMIT 1
    `;

    const subsubQuery1 = `
    SELECT preference_id, json_arrayagg(json_object('name', PJ.name)) AS preference_jobs
    FROM ${PREFERNCE_JOB_TABLE} AS PJ
    GROUP BY preference_id`;

    const subsubQuery2 = `
    SELECT preference_id, json_arrayagg(json_object('sido', PL.sido, 'sigungu', PL.sigungu)) AS preference_locations
    FROM ${PREFERNCE_LOCATION_TABLE} AS PL
    GROUP BY preference_id`;

    const subQuery8 = `
    SELECT resume_id, json_object('id', P.id, 'employ_type', P.employ_type, 'salary', P.salary, 'preference_jobs', pj.preference_jobs, 'preference_locations', pl.preference_locations) AS preference
    FROM ${PREFERNCE_TABLE} AS P
        JOIN (${subsubQuery1}) AS pj ON pj.preference_id = P.id
        JOIN (${subsubQuery2}) AS pl ON pl.preference_id = P.id
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const query = `
        SELECT
            R.id,
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
    const [rows] = await findOneOrWhole(
      {
        query,
        values: [
          resumeId,
          resumeId,
          resumeId,
          resumeId,
          resumeId,
          resumeId,
          resumeId,
          resumeId,
          resumeId,
        ],
      },
      pool
    )();

    return rows[0] as IFindWholeResume;
  }

  updateResume(id: number, { resume }: IUpdateResume) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${RESUME_TABLE}
        SET ?
        WHERE id = ?
    `;
    return update({ query, values: [resume, id] }, pool)();
  }

  updateResumeInfo(id: number, { resumeInfo }: UpdateResumeInfoDto) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${RESUME_INFO_TABLE}
        SET ?
        WHERE id = ?
    `;

    return update({ query, values: [resumeInfo, id] }, pool)();
  }

  updateEducation(id: number, { education }: UpdateEducationDto) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${EDUCATION_TABLE}
        SET ?
        WHERE id = ? 
    `;
    return update({ query, values: [education, id] }, pool)();
  }

  updateCareer(id: number, { career }: UpdateCareerDto) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${CAREER_TABLE}
        SET ?
        WHERE id = ? 
    `;
    return update({ query, values: [career, id] }, pool)();
  }

  updateActivity(id: number, { activity }: UpdateActivityDto) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${ACTIVITY_TABLE}
        SET ?
        WHERE id = ? 
    `;
    return update({ query, values: [activity, id] }, pool)();
  }

  updateAward(id: number, { award }: UpdateAwardDto) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${AWARD_TABLE}
        SET ?
        WHERE id = ? 
    `;
    return update({ query, values: [award, id] }, pool)();
  }

  updateMyVideo(id: number, { myVideo }: UpdateMyVideoDto) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${MY_VIDEO_TABLE}
        SET ?
        WHERE id = ? 
    `;
    return update({ query, values: [myVideo, id] }, pool)();
  }

  updateHelperVideo(id: number, { helperVideo }: UpdateHelperVideoDto) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${HELPER_VIDEO_TABLE}
        SET ?
        WHERE id = ? 
    `;
    return update({ query, values: [helperVideo, id] }, pool)();
  }

  updatePreference(id: number, { preference }: UpdatePreferenceDto) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${PREFERNCE_TABLE}
        SET ?
        WHERE id = ? 
    `;
    return update({ query, values: [preference, id] }, pool)();
  }

  updatePreferenceLocation(
    id: number,
    { preferenceLocation }: UpdatePreferenceLocationDto
  ) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${PREFERNCE_LOCATION_TABLE}
        SET ?
        WHERE id = ?
    `;
    return update(
      {
        query,
        values: [preferenceLocation, id],
      },
      pool
    )();
  }

  updatePreferenceJob(id: number, { preferenceJob }: UpdatePreferenceJobDto) {
    const pool = this.mysql.getPool();

    const query = `
        UPDATE ${PREFERNCE_JOB_TABLE}
        SET ?
        WHERE id = ?
    `;
    return update({ query, values: [preferenceJob, id] }, pool)();
  }

  deleteResume(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${RESUME_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deleteResumeInfo(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${RESUME_INFO_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deleteEducation(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${EDUCATION_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deleteCareer(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${CAREER_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deleteActivity(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${ACTIVITY_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deleteAward(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${AWARD_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deleteMyVideo(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${MY_VIDEO_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deleteHelperVideo(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${HELPER_VIDEO_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deletePreference(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${PREFERNCE_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deletePreferenceJob(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${PREFERNCE_JOB_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }

  deletePreferenceLocation(id: number) {
    const pool = this.mysql.getPool();
    const query = `
        DELETE FROM ${PREFERNCE_LOCATION_TABLE}
        WHERE id = ?
    `;

    return update({ query, values: [id] }, pool)();
  }
}
