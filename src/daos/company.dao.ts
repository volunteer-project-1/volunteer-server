import { plainToInstance } from "class-transformer";
import { Service } from "typedi";
import {
  COMPANY_HISTORY_TABLE,
  JD_DETAIL_TABLE,
  JD_STEPS_TABLE,
  JOB_DESCRIPTION_TABLE,
  JD_WELFARE_TABLE,
  JD_WORK_CONDITION_TABLE,
  RESUME_APPLYING_TABLE,
  RESUME_TABLE,
} from "../constants";
import { findOneOrWhole, insert, MySQL, Prisma, update } from "../db";
import {
  CreateCompanyHistoryDto,
  FindJobDescriptionDto,
  UpdateCompanyDto,
  UpdateCompanyHistoryDto,
} from "../dtos";
import { IComapnyDAO, ICreateCompany, ICreateJobDescription } from "../types";

@Service()
export class CompanyDAO implements IComapnyDAO {
  constructor(private readonly mysql: MySQL, private readonly prisma: Prisma) {}

  async createCompany({
    email,
    password,
    salt,
    name,
  }: ICreateCompany & { salt: string }) {
    return this.prisma.client.companys.create({
      data: {
        email,
        password,
        salt,
        name,
      },
    });
  }

  async updateCompany(companyId: number, data: UpdateCompanyDto) {
    return this.prisma.client.companys.update({
      where: { id: companyId },
      data: { ...data },
    });
  }

  async findCompanyByEmail(email: string) {
    return this.prisma.client.companys.findUnique({ where: { email } });
  }

  async findCompanyById(id: number) {
    return this.prisma.client.companys.findUnique({ where: { id } });
  }

  async findCompanyHistory(id: number) {
    return this.prisma.client.companyHistories.findUnique({ where: { id } });
  }

  async findCompanyList({ start, limit }: { start: number; limit: number }) {
    return this.prisma.client.companys.findMany({
      where: { id: { gte: start } },
      skip: limit,
      orderBy: { id: "asc" },
    });
  }

  async createCompanyHistory(companyId: number, data: CreateCompanyHistoryDto) {
    const conn = this.mysql.getPool();

    const companyHistoryField = Object.keys(data).concat("company_id");

    const query = `
    INSERT 
    INTO ${COMPANY_HISTORY_TABLE} 
        (${companyHistoryField})
    VALUES 
        (?)`;

    const [result] = await insert(
      { query, values: [Object.values<any>(data).concat(companyId)] },
      conn
    )();

    if (result.affectedRows === 0) {
      throw new Error();
    }

    return result;
  }

  async updateCompanyHistory(id: number, data: UpdateCompanyHistoryDto) {
    const conn = this.mysql.getPool();

    const query = `
        UPDATE ${COMPANY_HISTORY_TABLE} 
        SET ?
        WHERE id = ?`;

    const [result] = await update({ query, values: [data, id] }, conn)();

    return result;
  }

  async createJobDescription(
    id: number,
    {
      jobDescription,
      jdDetails,
      jdWorkCondition,
      jdSteps,
      jdWelfares,
    }: ICreateJobDescription
  ) {
    const conn = await this.mysql.getConnection();

    const jobDescriptionField =
      Object.keys(jobDescription).concat("company_id");
    const jobDescriptionQuery = `
        INSERT INTO ${JOB_DESCRIPTION_TABLE}
        (${jobDescriptionField})
        VALUES (?)
    `;

    const jobDetailField = Object.keys(jdDetails[0]).concat(
      "job_description_id"
    );
    const jdDetailQuery = `
        INSERT INTO ${JD_DETAIL_TABLE}
        (${jobDetailField})
        VALUES (?)
    `;

    const workConditionField =
      Object.keys(jdWorkCondition).concat("job_description_id");
    const workConditionQuery = `
        INSERT INTO ${JD_WORK_CONDITION_TABLE}
        (${workConditionField})
        VALUES (?)
    `;

    const jdStepField = Object.keys(jdSteps[0]).concat("job_description_id");
    const jdStepQuery = `
        INSERT INTO ${JD_STEPS_TABLE}
        (${jdStepField})
        VALUES (?)
    `;

    const welfareField = Object.keys(jdWelfares[0]).concat(
      "job_description_id"
    );
    const welfareQuery = `
        INSERT INTO ${JD_WELFARE_TABLE}
        (${welfareField})
        VALUES (?)
    `;

    try {
      await conn.beginTransaction();

      const [createdJobDescription] = await insert(
        {
          query: jobDescriptionQuery,
          values: [Object.values<any>(jobDescription).concat(id)],
        },
        conn
      )();

      const createdJdDetails = await Promise.all(
        jdDetails.map(async (jdDetail) => {
          const [row] = await insert(
            {
              query: jdDetailQuery,
              values: [
                Object.values<any>(jdDetail).concat(
                  createdJobDescription.insertId
                ),
              ],
            },
            conn
          )();
          return row;
        })
      );

      const [createdWorkCondition] = await insert(
        {
          query: workConditionQuery,
          values: [
            Object.values<any>(jdWorkCondition).concat(
              createdJobDescription.insertId
            ),
          ],
        },
        conn
      )();

      const createdJdSteps = await Promise.all(
        jdSteps.map(async (jdStep) => {
          const [row] = await insert(
            {
              query: jdStepQuery,
              values: [
                Object.values<any>(jdStep).concat(
                  createdJobDescription.insertId
                ),
              ],
            },
            conn
          )();

          return row;
        })
      );

      const createdWelfares = await Promise.all(
        jdWelfares.map(async (welfare) => {
          const [row] = await insert(
            {
              query: welfareQuery,
              values: [
                Object.values<any>(welfare).concat(
                  createdJobDescription.insertId
                ),
              ],
            },
            conn
          )();

          return row;
        })
      );

      await conn.commit();

      return {
        jobDescription: createdJobDescription,
        jdDetails: createdJdDetails,
        jdWorkCondition: createdWorkCondition,
        jdSteps: createdJdSteps,
        jdWelfares: createdWelfares,
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async findJobDescriptionById(id: number) {
    const conn = await this.mysql.getConnection();

    const jdDetailQuery = `
        SELECT 
            job_description_id,
            json_arrayagg(
                json_object(
                    'id', JDD.id,
                    'title', JDD.title,
                    'num_recruitment', JDD.num_recruitment,
                    'role', JDD.role,
                    'requirements', JDD.requirements,
                    'priority', JDD.priority
                )
            ) as jd_details
        FROM ${JD_DETAIL_TABLE} as JDD
        GROUP BY job_description_id
    `;

    const jdWorkConditionQuery = `
        SELECT 
            job_description_id, 
            json_object(
                'id', JDWC.id,
                'type', JDWC.type,
                'time', JDWC.time,
                'place', JDWC.place
            ) as jd_work_condition
        FROM ${JD_WORK_CONDITION_TABLE} as JDWC
        GROUP BY job_description_id
    `;

    const jdStepQuery = `
        SELECT 
            job_description_id,
            json_arrayagg(
                json_object(
                    'id', JDS.id,
                    'step', JDS.step,
                    'title', JDS.title
                )
            ) as jd_steps
        FROM ${JD_STEPS_TABLE} as JDS
        GROUP BY job_description_id
    `;

    const jdWelfareQuery = `
        SELECT 
            job_description_id,
            json_arrayagg(
                json_object(
                    'id', JDW.id,
                    'title', JDW.title,
                    'content', JDW.content
                )
            ) as jd_welfares
        FROM ${JD_WELFARE_TABLE} as JDW
        GROUP BY job_description_id
    `;

    const query = `
        SELECT 
            jd.*,
            jdd.jd_details,
            jdwc.jd_work_condition,
            jds.jd_steps,
            jdw.jd_welfares
        FROM ${JOB_DESCRIPTION_TABLE} jd
        LEFT JOIN (${jdDetailQuery}) jdd ON jdd.job_description_id = jd.id
        LEFT JOIN (${jdWorkConditionQuery}) jdwc ON jdwc.job_description_id = jd.id
        LEFT JOIN (${jdStepQuery}) jds ON jds.job_description_id = jd.id
        LEFT JOIN (${jdWelfareQuery}) jdw ON jdw.job_description_id = jd.id
        WHERE jd.id = ?`;

    const [rows] = await findOneOrWhole({ query, values: [id] }, conn)();

    if (!rows.length) {
      return undefined;
    }

    return plainToInstance(FindJobDescriptionDto, rows[0]);
  }

  async createResumeApplying({
    userId,
    resumeId,
    jdDetailId,
  }: {
    userId: number;
    resumeId: number;
    jdDetailId: number;
  }) {
    const conn = await this.mysql.getConnection();

    const query = `
        INSERT INTO 
            ${RESUME_APPLYING_TABLE} 
        (user_id, resume_id, jd_detail_id) 
        VALUES 
            (?, ?, ?)`;

    const [result] = await insert(
      { query, values: [userId, resumeId, jdDetailId] },
      conn
    )();

    if (result.affectedRows === 0) {
      throw new Error();
    }
    return result;
  }

  async findResumeApplyingByUserId(userId: number) {
    const conn = await this.mysql.getConnection();

    const subQuery = `
        SELECT
            ra.id resume_applying_id,
            detail.job_description_id job_description_id,
            detail.id detail_id,
            detail.role role,
            resume.id resume_id,
            resume.title resume_title,
            ra.created_at created_at
        FROM 
            ${RESUME_APPLYING_TABLE} AS ra
        JOIN ${JD_DETAIL_TABLE} AS detail 
            ON detail.id = ra.jd_detail_id
        JOIN ${RESUME_TABLE} AS resume 
            ON resume.id = ra.resume_id
        WHERE 
            ra.user_id = ?
        GROUP BY resume_applying_id
        ORDER BY ra.created_at desc
    `;

    const query = `
        SELECT 
            jobd.id job_description_id,
            q.*
        FROM 
            ${JOB_DESCRIPTION_TABLE} jobd
        JOIN (${subQuery}) AS q 
            ON q.job_description_id = jobd.id
        GROUP BY q.resume_applying_id
        
    `;
    const [rows] = await findOneOrWhole({ query, values: [userId] }, conn)();

    if (!rows.length) {
      return undefined;
    }

    return rows;
  }
}
