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

        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        deleted_at DATETIME(3) DEFAULT NULL,
        
        PRIMARY KEY (id)
    );

      CREATE TABLE if not exists user_metas (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        is_verified BOOLEAN DEFAULT false,
        type VARCHAR(10) DEFAULT 'employee',
        user_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists profiles (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        address VARCHAR(255),
        birthday DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        user_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists resumes (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        content VARCHAR(255),
        user_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists resume_infos (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        birthday DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        phone_number VARCHAR(20),
        email VARCHAR(20),
        address VARCHAR(255),
        disability_level INT,
        disability_type INT,
        SEX INT,
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
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists education_details (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        major VARCHAR(20),
        credit INT,
        total_credit INT,
        education_id BIGINT UNSIGNED NOT NULL,
        
        PRIMARY KEY (id),
        FOREIGN KEY (education_id) REFERENCES educations(id) ON DELETE CASCADE
      );

      

      CREATE TABLE if not exists careers (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        company VARCHAR(100),
        department VARCHAR(100),
        position VARCHAR(20),
        task VARCHAR(255),
        joined_at DATETIME(3) DEFAULT NULL,
        quited_at DATETIME(3) DEFAULT NULL,
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

      CREATE TABLE if not exists awards (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        institute VARCHAR(100),
        started_at DATETIME(3) DEFAULT NULL,
        finished_at DATETIME(3) DEFAULT NULL,
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists resume_videos (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists my_videos (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        url VARCHAR(255),
        resume_video_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_video_id) REFERENCES resume_videos(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists helper_videos (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        url VARCHAR(255),
        resume_video_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_video_id) REFERENCES resume_videos(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists preferences (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        employ_type VARCHAR(20),
        salary VARCHAR(20),
        resume_id BIGINT UNSIGNED NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE
      );

      CREATE TABLE if not exists preference_locations (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100),
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
        
      

      
  `);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
