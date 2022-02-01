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

      CREATE TABLE if not exists user_type (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        
        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists user_meta (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        type_id BIGINT UNSIGNED,

        PRIMARY KEY (id),
        FOREIGN KEY (type_id)
          REFERENCES user_type(id)
      );

      CREATE TABLE if not exists profile (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        email VARCHAR(20),
        address VARCHAR(255),
        birthday DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists resume_info (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        birthday DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        phone_number VARCHAR(20),
        email VARCHAR(20),
        address VARCHAR(255),
        disability_level INT,
        disability_type INT,
        SEX INT,

        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists school_type (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(40),
        
        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists education_detail (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        major VARCHAR(20),
        credit INT,
        total_credit INT,
        
        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists education (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        school_type_id BIGINT UNSIGNED,
        school_name VARCHAR(100),
        graduation_year DATETIME(3),
        admission_year DATETIME(3),
        is_graduated BOOLEAN,
        education_detail_id BIGINT UNSIGNED,
        
        PRIMARY KEY (id),
        FOREIGN KEY (school_type_id)
          REFERENCES school_type(id),
        FOREIGN KEY (education_detail_id)
          REFERENCES education_detail(id)
      );

      CREATE TABLE if not exists career (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        company VARCHAR(100),
        department VARCHAR(100),
        position VARCHAR(20),
        task VARCHAR(255),
        joined_at DATETIME(3) DEFAULT NULL,
        quited_at DATETIME(3) DEFAULT NULL,
        is_in_office BOOLEAN,

        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists activity (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        organization VARCHAR(100),
        description VARCHAR(100),

        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists award (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(20),
        institute VARCHAR(100),
        started_at DATETIME(3) DEFAULT NULL,
        finished_at DATETIME(3) DEFAULT NULL,

        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists resume_introduction (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100),
        content VARCHAR(255),

        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists my_video (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        url VARCHAR(255),

        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists helper_video (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        url VARCHAR(255),

        PRIMARY KEY (id)
      );

      CREATE TABLE if not exists resume_vides (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        my_video_id BIGINT UNSIGNED,
        helper_video_id BIGINT UNSIGNED,

        PRIMARY KEY (id),
        FOREIGN KEY (my_video_id)
          REFERENCES my_video(id),
        FOREIGN KEY (helper_video_id)
          REFERENCES helper_video(id)
      );

      CREATE TABLE if not exists resume (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        information_id BIGINT UNSIGNED,
        education_id BIGINT UNSIGNED,
        career_id BIGINT UNSIGNED,
        activity_id BIGINT UNSIGNED,
        award_id BIGINT UNSIGNED,
        resume_introduction_id BIGINT UNSIGNED,
        resume_vides_id BIGINT UNSIGNED,

        PRIMARY KEY (id),
        FOREIGN KEY (information_id)
          REFERENCES resume_info(id),
        FOREIGN KEY (education_id)
          REFERENCES education(id),
        FOREIGN KEY (activity_id)
          REFERENCES activity(id),
        FOREIGN KEY (award_id)
          REFERENCES award(id),
        FOREIGN KEY (resume_introduction_id)
          REFERENCES resume_introduction(id),
        FOREIGN KEY (resume_vides_id)
          REFERENCES resume_vides(id)
      );

      CREATE TABLE if not exists preference_location (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100),

        PRIMARY KEY (id)        
      );

      
      CREATE TABLE if not exists preference_job (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(100),
        
        PRIMARY KEY (id)        
      );
        
      CREATE TABLE if not exists preference (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        employ_type VARCHAR(20),
        salary VARCHAR(20),
        preference_location_id BIGINT UNSIGNED,
        preference_job_id BIGINT UNSIGNED,

        PRIMARY KEY (id),
        FOREIGN KEY (preference_location_id)
          REFERENCES preference_location(id),
        FOREIGN KEY (preference_job_id)
          REFERENCES preference_job(id)  
      );

      CREATE TABLE if not exists user (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        profile_id BIGINT UNSIGNED,
        user_meta_id BIGINT UNSIGNED,
        resume_id BIGINT UNSIGNED,

        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        deleted_at DATETIME(3) DEFAULT NULL,
        
        FOREIGN KEY (profile_id)
          REFERENCES profile(id),
        FOREIGN KEY (user_meta_id)
          REFERENCES user_meta (id),
        PRIMARY KEY (id)
    );
  `);
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
