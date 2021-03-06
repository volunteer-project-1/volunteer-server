/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
let dbm;
let type;
let seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.runSql(`

    CREATE TABLE if not exists users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(40) NOT NULL UNIQUE,
        password VARCHAR(1000),
        salt VARCHAR(1000),

        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        deleted_at DATETIME(3),
        
        PRIMARY KEY (id)
    );

      CREATE TABLE if not exists user_metas (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        is_verified BOOLEAN DEFAULT false,
        type VARCHAR(10) DEFAULT 'seeker',
        user_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists profiles (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        address VARCHAR(255),
        birthday DATETIME(3),
        user_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists resumes (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL UNIQUE,
        content VARCHAR(255),
        is_public BOOLEAN DEFAULT true,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        user_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists resume_infos (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        birthday timestamp(3) NOT NULL,
        phone_number VARCHAR(20),
        email VARCHAR(20),
        sido VARCHAR(20),
        sigungu VARCHAR(20),
        disability_level INT,
        disability_type VARCHAR(20),
        sex VARCHAR(5),
        avatar VARCHAR(255),
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists educations (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        type VARCHAR(20),
        school_name VARCHAR(100),
        graduation_year DATETIME(3),
        admission_year DATETIME(3),
        is_graduated BOOLEAN,
        major VARCHAR(10),
        credit DECIMAL(3,2),
        total_credit DECIMAL(3,2),
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists careers (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        company VARCHAR(100),
        department VARCHAR(100),
        position VARCHAR(20),
        task VARCHAR(255),
        joined_at DATETIME(3),
        quited_at DATETIME(3),
        is_in_office BOOLEAN,
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists activities (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        organization VARCHAR(100),
        description VARCHAR(100),
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists trainings (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(30),
        institute VARCHAR(100),
        started_at DATETIME(3),
        finished_at DATETIME(3),
        content VARCHAR(300),

        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists certificates (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(30),
        institute VARCHAR(100),
        acquisition_at DATETIME(3),
        
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists awards (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        institute VARCHAR(100),
        started_at DATETIME(3),
        finished_at DATETIME(3),
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists portfolios (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        url VARCHAR(255),

        resume_id BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );
      
      CREATE TABLE if not exists introductions (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(30),
        content VARCHAR(800),

        resume_id BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists my_videos (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        url VARCHAR(255),
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists helper_videos (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        url VARCHAR(255),
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists preferences (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        employ_type VARCHAR(20),
        salary SMALLINT DEFAULT 0,
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists preference_locations (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        sido VARCHAR(20),
        sigungu VARCHAR(20),
        preference_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (preference_id) REFERENCES preferences(id) ON DELETE CASCADE
      );
      
      CREATE TABLE if not exists preference_jobs (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100),
        preference_id BIGINT UNSIGNED NOT NULL,
        
        PRIMARY KEY (id),
        FOREIGN KEY (preference_id) REFERENCES preferences(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists companys (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(40) NOT NULL UNIQUE,
        password VARCHAR(1000) NOT NULL,
        salt VARCHAR(1000) NOT NULL,
        name VARCHAR(20) NOT NULL,
        introduce VARCHAR(5000),
        founded_at DATETIME(3),
        member SMALLINT NOT NULL DEFAULT 1,
        acc_investment SMALLINT NOT NULL DEFAULT 0,
        homepage VARCHAR(255),
        phone_number VARCHAR(20),
        address VARCHAR(255),
        industry_type VARCHAR(20),

        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        deleted_at DATETIME(3),
        
        PRIMARY KEY (id)
    );

      CREATE TABLE if not exists company_histories (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        content VARCHAR(600) NOT NULL,
        history_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        company_id BIGINT UNSIGNED NOT NULL,
        UNIQUE(company_id),

        PRIMARY KEY (id),
        FOREIGN KEY (company_id) REFERENCES companys(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists job_descriptions (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        started_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        deadline_at DATETIME(3) NOT NULL,
        category VARCHAR(50) NOT NULL,
        company_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (company_id) REFERENCES companys(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists jd_details (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        num_recruitment BIGINT UNSIGNED NOT NULL DEFAULT 0,
        role VARCHAR(500) NOT NULL,
        requirements VARCHAR(1000) NOT NULL,
        priority VARCHAR(1000) NOT NULL,
        job_description_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (job_description_id) REFERENCES job_descriptions(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists resume_applyings (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id BIGINT UNSIGNED NOT NULL,
        resume_id BIGINT UNSIGNED NOT NULL,
        jd_detail_id BIGINT UNSIGNED NOT NULL,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        deleted_at DATETIME(3),

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id),
        FOREIGN KEY (jd_detail_id) REFERENCES jd_details(id)
      );

      CREATE TABLE if not exists jd_work_conditions (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        type VARCHAR(500) NOT NULL,
        time VARCHAR(500) NOT NULL,
        place VARCHAR(500) NOT NULL,
        job_description_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (job_description_id) REFERENCES job_descriptions(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists jd_steps (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        step BIGINT UNSIGNED NOT NULL DEFAULT 1,
        title VARCHAR (100) NOT NULL,
        job_description_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (job_description_id) REFERENCES job_descriptions(id) ON DELETE CASCADE
      );
      
      CREATE TABLE if not exists jd_welfares (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(50) NOT NULL,
        content VARCHAR(150) NOT NULL,
        job_description_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (job_description_id) REFERENCES job_descriptions(id) ON DELETE CASCADE
      );
  `);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
