import { Service } from "typedi";
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
  CERTIFICATE_TABLE,
  INTRODUCTION_TABLE,
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
      introductions,
      myVideo,
      helperVideo,
      preference,
    }: ICreateResume
  ) {
    const conn = await this.mysql.getConnection();

    try {
      await conn.beginTransaction();

      const resumeField = Object.keys(resume).concat("user_id");
      const resumeQuery = `
        INSERT INTO ${RESUME_TABLE} 
            (${resumeField}) 
        VALUES 
            (?)`;

      const [createdResume] = await insert(
        {
          query: resumeQuery,
          values: [Object.values<any>(resume).concat(userId)],
        },
        conn
      )();

      const resumeInfoFieldNames = Object.keys(resumeInfo).concat("resume_id");
      const resumeInfosQuery = `
        INSERT INTO ${RESUME_INFO_TABLE} 
            (${resumeInfoFieldNames}) 
        VALUES 
            (?, ${createdResume.insertId});`;

      const [createdResumeInfo] = await insert(
        { query: resumeInfosQuery, values: [Object.values<any>(resumeInfo)] },
        conn
      )();

      if (educations) {
        educations.map(async (education) => {
          const educationFieldNames =
            Object.keys(education).concat("resume_id");
          const educationQuery = `
            INSERT INTO ${EDUCATION_TABLE} 
                (${educationFieldNames}) 
            VALUES 
                (?, ${createdResume.insertId});`;

          await insert(
            {
              query: educationQuery,
              values: [Object.values<any>(education)],
            },
            conn
          )();
        });
      }

      if (careers) {
        careers.map(async (career) => {
          const carrerFieldNames = Object.keys(career).concat("resume_id");
          const carrerQuery = `
            INSERT INTO ${CAREER_TABLE} 
                (${carrerFieldNames}) 
            VALUES 
                (?, ${createdResume.insertId})`;

          await insert(
            { query: carrerQuery, values: [Object.values(career)] },
            conn
          )();
        });
      }

      if (activities) {
        activities.map(async (activity) => {
          const activityFieldNames = Object.keys(activity).concat("resume_id");
          const activityQuery = `
            INSERT INTO ${ACTIVITY_TABLE} 
                (${activityFieldNames}) 
            VALUES 
                (?, ${createdResume.insertId})`;

          await insert(
            {
              query: activityQuery,
              values: [Object.values(activity)],
            },
            conn
          )();
        });
      }

      if (trainings) {
        for (const training of trainings) {
          const trainingFieldNames = Object.keys(training).concat("resume_id");
          const trainingQuery = `
              INSERT INTO ${TRAINING_TABLE} 
                  (${trainingFieldNames}) 
              VALUES 
                  (?, ${createdResume.insertId})`;

          await insert(
            {
              query: trainingQuery,
              values: [Object.values(training)],
            },
            conn
          )();
        }
      }
      if (certificates) {
        for (const certificate of certificates) {
          const certificateFieldNames =
            Object.keys(certificate).concat("resume_id");
          const certificateQuery = `
            INSERT INTO ${CERTIFICATE_TABLE} 
                (${certificateFieldNames}) 
            VALUES 
                (?, ${createdResume.insertId})`;

          await insert(
            {
              query: certificateQuery,
              values: [Object.values(certificate)],
            },
            conn
          )();
        }
      }

      if (awards) {
        for (const award of awards) {
          const awardFieldNames = Object.keys(award).concat("resume_id");
          const awardQuery = `
            INSERT INTO ${AWARD_TABLE} 
                (${awardFieldNames}) 
            VALUES 
                (?, ${createdResume.insertId})`;

          await insert(
            { query: awardQuery, values: [Object.values(award)] },
            conn
          )();
        }
      }

      if (portfolio) {
        const portfolioFieldNames = Object.keys(portfolio).concat("resume_id");
        const portfolioQuery = `
            INSERT INTO ${PORTFOLIO_TABLE} 
                (${portfolioFieldNames}) 
            VALUES 
                (?, ${createdResume.insertId})`;

        await insert(
          {
            query: portfolioQuery,
            values: [Object.values(portfolio)],
          },
          conn
        )();
      }

      if (introductions) {
        for (const introduction of introductions) {
          const introductionFieldNames =
            Object.keys(introduction).concat("resume_id");

          const introductionQuery = `
            INSERT INTO ${INTRODUCTION_TABLE} 
                (${introductionFieldNames}) 
            VALUES 
                (?, ${createdResume.insertId})`;

          await insert(
            { query: introductionQuery, values: [Object.values(introduction)] },
            conn
          )();
        }
      }

      const myVideoFieldNames = Object.keys(myVideo).concat("resume_id");
      const myVideoQuery = `
        INSERT INTO ${MY_VIDEO_TABLE} 
            (${myVideoFieldNames}) 
        VALUES 
            (?, ${createdResume.insertId})`;

      await insert(
        { query: myVideoQuery, values: [Object.values(myVideo)] },
        conn
      )();

      if (helperVideo) {
        const helperVideoFieldNames =
          Object.keys(helperVideo).concat("resume_id");
        const helperVideoQuery = `
            INSERT INTO ${HELPER_VIDEO_TABLE} 
                (${helperVideoFieldNames}) 
            VALUES 
                (?, ${createdResume.insertId})`;

        await insert(
          { query: helperVideoQuery, values: [Object.values(helperVideo)] },
          conn
        )();
      }

      if (preference) {
        const { preferenceJobs, preferenceLocations, ...restPreference } =
          preference;
        const preferenceFieldNames =
          Object.keys(restPreference).concat("resume_id");
        const preferenceQuery = `
            INSERT INTO ${PREFERNCE_TABLE} 
                (${preferenceFieldNames}) 
            VALUES 
                (?, ${createdResume.insertId})`;

        const [createdPreference] = await insert(
          { query: preferenceQuery, values: [Object.values(restPreference)] },
          conn
        )();

        if (preferenceJobs) {
          for (const preferenceJob of preferenceJobs) {
            const preferenceJobFieldNames =
              Object.keys(preferenceJob).concat("preference_id");
            const preferenceJobQuery = `
            INSERT INTO ${PREFERNCE_JOB_TABLE} 
                (${preferenceJobFieldNames}) 
            VALUES 
                (?, ${createdPreference.insertId})`;
            await insert(
              {
                query: preferenceJobQuery,
                values: [Object.values(preferenceJob)],
              },
              conn
            )();
          }
        }
        if (preferenceLocations) {
          for (const preferenceLocation of preferenceLocations) {
            const preferenceLocationFieldNames =
              Object.keys(preferenceLocation).concat("preference_id");
            const preferenceLocationQuery = `
            INSERT INTO ${PREFERNCE_LOCATION_TABLE} 
                (${preferenceLocationFieldNames}) 
            VALUES 
                (?, ${createdPreference.insertId})`;
            await insert(
              {
                query: preferenceLocationQuery,
                values: [Object.values(preferenceLocation)],
              },
              conn
            )();
          }
        }
      }

      await insert(
        {
          query: `
          UPDATE ${USER_METAS_TABLE} AS m
            SET 
                m.is_verified = IF( m.is_verified=0, 1, m.is_verified)
          WHERE 
            m.user_id = ?;`,
          values: [userId],
        },
        conn
      )();

      await conn.commit();

      return { resume: createdResume, resumeInfo: createdResumeInfo };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      await conn.release();
    }
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

    const resumeQuery = `
    SELECT resume_id, json_object(
        'id', RI.id, 
        'name', RI.name, 
        'birthday', RI.birthday, 
        'phone_number', RI.phone_number, 
        'email', RI.email, 
        'sido', RI.sido, 
        'sigungu', RI.sigungu, 
        'disability_level', RI.disability_level, 
        'disability_type', RI.disability_type, 
        'sex', RI.sex) AS resume_info
    FROM ${RESUME_INFO_TABLE} AS RI
    WHERE resume_id = ?
    GROUP BY resume_id
    LIMIT 1
    `;

    const careerQuery = `
    SELECT resume_id, json_arrayagg(json_object('id', C.id, 'company', C.company, 'department', C.department)) AS careers
    FROM ${CAREER_TABLE} AS C
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const educationQuery = `
    SELECT resume_id, json_arrayagg(json_object('id', E.id, 'type', E.type, 'school_name', E.school_name)) AS educations
    FROM ${EDUCATION_TABLE} AS E
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const activityQuery = `
    SELECT resume_id, json_arrayagg(json_object(
        'id', A.id, 
        'organization', A.organization, 
        'description', A.description)) AS activities
    FROM ${ACTIVITY_TABLE} AS A
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const trainingQuery = `
    SELECT 
        resume_id, 
        json_arrayagg(json_object(
            'id', TR.id, 
            'name', TR.name, 
            'institute', TR.institute, 
            'started_at', TR.started_at, 
            'finished_at', TR.finished_at, 
            'content', TR.content)) AS trainings
    FROM ${TRAINING_TABLE} AS TR
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const certificateQuery = `
    SELECT resume_id, json_arrayagg(json_object(
        'id', CE.id, 
        'name', CE.name, 
        'institute', CE.institute, 
        'acquisition_at', CE.acquisition_at)) AS certificates
    FROM ${CERTIFICATE_TABLE} AS CE
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const awardQuery = `
    SELECT resume_id, json_arrayagg(json_object('id', W.id, 'institute', W.institute, 'started_at', W.started_at)) AS awards
    FROM ${AWARD_TABLE} AS W
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const portfolioQuery = `
    SELECT resume_id, json_object(
        'id', PO.id, 
        'url', PO.url) AS portfolio
    FROM ${PORTFOLIO_TABLE} AS PO
    WHERE resume_id = ?
    GROUP BY resume_id
    LIMIT 1
    `;

    const introductionQuery = `
    SELECT resume_id, json_arrayagg(json_object(
        'id', INTRO.id, 
        'title', INTRO.title, 
        'content', INTRO.content)) AS introductions
    FROM ${INTRODUCTION_TABLE} AS INTRO
    WHERE resume_id = ?
    GROUP BY resume_id
    `;

    const myVideoQuery = `
    SELECT resume_id, json_object('id', MY.id, 'url', MY.url) AS my_video
    FROM ${MY_VIDEO_TABLE} AS MY
    WHERE resume_id = ?
    GROUP BY resume_id
    LIMIT 1
    `;

    const helperVideoQuery = `
    SELECT resume_id, json_object('id', H.id, 'url', H.url) AS helper_video
    FROM ${HELPER_VIDEO_TABLE} AS H
    WHERE resume_id = ?
    GROUP BY resume_id
    LIMIT 1
    `;

    const preferenceJobQuery = `
    SELECT preference_id, json_arrayagg(json_object('name', PJ.name)) AS preference_jobs
    FROM ${PREFERNCE_JOB_TABLE} AS PJ
    GROUP BY preference_id`;

    const preferenceLocationQuery = `
    SELECT preference_id, json_arrayagg(json_object('sido', PL.sido, 'sigungu', PL.sigungu)) AS preference_locations
    FROM ${PREFERNCE_LOCATION_TABLE} AS PL
    GROUP BY preference_id`;

    const preferenceQuery = `
    SELECT resume_id, json_object('id', P.id, 'employ_type', P.employ_type, 'salary', P.salary, 'preference_jobs', pj.preference_jobs, 'preference_locations', pl.preference_locations) AS preference
    FROM ${PREFERNCE_TABLE} AS P
        JOIN (${preferenceJobQuery}) AS pj ON pj.preference_id = P.id
        JOIN (${preferenceLocationQuery}) AS pl ON pl.preference_id = P.id
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
            p.preference,
            tr.trainings,
            ce.certificates,
            po.portfolio,
            intro.introductions
        FROM ${RESUME_TABLE} AS R
        LEFT JOIN (${resumeQuery}) AS ri ON ri.resume_id = R.id
        LEFT JOIN (${careerQuery}) AS c ON c.resume_id = R.id
        LEFT JOIN (${educationQuery}) AS e ON e.resume_id = R.id
        LEFT JOIN (${activityQuery}) AS a ON a.resume_id = R.id
        LEFT JOIN (${awardQuery}) AS w ON w.resume_id = R.id
        LEFT JOIN (${myVideoQuery}) AS my ON my.resume_id = R.id
        LEFT JOIN (${helperVideoQuery}) AS h ON h.resume_id = R.id
        LEFT JOIN (${preferenceQuery}) AS p ON p.resume_id = R.id
        LEFT JOIN (${trainingQuery}) AS tr ON tr.resume_id = R.id
        LEFT JOIN (${certificateQuery}) AS ce ON ce.resume_id = R.id
        LEFT JOIN (${portfolioQuery}) AS po ON po.resume_id = R.id
        LEFT JOIN (${introductionQuery}) AS intro ON intro.resume_id = R.id
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
