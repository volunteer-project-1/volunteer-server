-- CreateTable
CREATE TABLE `activities` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `organization` VARCHAR(100) NULL,
    `description` VARCHAR(100) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `awards` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NULL,
    `institute` VARCHAR(100) NULL,
    `started_at` DATETIME(3) NULL,
    `finished_at` DATETIME(3) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `careers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `company` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `position` VARCHAR(20) NULL,
    `task` VARCHAR(255) NULL,
    `joined_at` DATETIME(3) NULL,
    `quited_at` DATETIME(3) NULL,
    `is_in_office` BOOLEAN NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificates` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NULL,
    `institute` VARCHAR(100) NULL,
    `acquisition_at` DATETIME(3) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_histories` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(600) NOT NULL,
    `history_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `company_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `company_id`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companys` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(40) NOT NULL,
    `password` VARCHAR(1000) NOT NULL,
    `salt` VARCHAR(1000) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `introduce` VARCHAR(5000) NULL,
    `founded_at` DATETIME(3) NULL,
    `member` SMALLINT NOT NULL DEFAULT 1,
    `acc_investment` SMALLINT NOT NULL DEFAULT 0,
    `homepage` VARCHAR(255) NULL,
    `phone_number` VARCHAR(20) NULL,
    `address` VARCHAR(255) NULL,
    `industry_type` VARCHAR(20) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `companys_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `educations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(20) NULL,
    `school_name` VARCHAR(100) NULL,
    `graduation_year` DATETIME(3) NULL,
    `admission_year` DATETIME(3) NULL,
    `is_graduated` BOOLEAN NULL,
    `major` VARCHAR(10) NULL,
    `credit` DECIMAL(3, 2) NULL,
    `total_credit` DECIMAL(3, 2) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `helper_videos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `helper_videos_resume_id_key`(`resume_id`),
    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `introductions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NULL,
    `content` VARCHAR(800) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jd_details` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `num_recruitment` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `role` VARCHAR(500) NOT NULL,
    `requirements` VARCHAR(1000) NOT NULL,
    `priority` VARCHAR(1000) NOT NULL,
    `job_description_id` INTEGER UNSIGNED NOT NULL,

    INDEX `job_description_id`(`job_description_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jd_steps` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `step` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `title` VARCHAR(100) NOT NULL,
    `job_description_id` INTEGER UNSIGNED NOT NULL,

    INDEX `job_description_id`(`job_description_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jd_welfares` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `content` VARCHAR(150) NOT NULL,
    `job_description_id` INTEGER UNSIGNED NOT NULL,

    INDEX `job_description_id`(`job_description_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jd_work_conditions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(500) NOT NULL,
    `time` VARCHAR(500) NOT NULL,
    `place` VARCHAR(500) NOT NULL,
    `job_description_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `jd_work_conditions_job_description_id_key`(`job_description_id`),
    INDEX `job_description_id`(`job_description_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `job_descriptions` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deadline_at` DATETIME(3) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `company_id` INTEGER UNSIGNED NOT NULL,

    INDEX `company_id`(`company_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `my_videos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `my_videos_resume_id_key`(`resume_id`),
    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolios` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preference_jobs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `preference_id` INTEGER UNSIGNED NOT NULL,

    INDEX `preference_id`(`preference_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preference_locations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `sido` VARCHAR(20) NULL,
    `sigungu` VARCHAR(20) NULL,
    `preference_id` INTEGER UNSIGNED NOT NULL,

    INDEX `preference_id`(`preference_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preferences` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `employ_type` VARCHAR(20) NULL,
    `salary` SMALLINT NULL DEFAULT 0,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NULL,
    `address` VARCHAR(255) NULL,
    `birthday` DATETIME(3) NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `profiles_user_id_key`(`user_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_applyings` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,
    `job_description_id` INTEGER UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    INDEX `job_description_id`(`job_description_id`),
    INDEX `resume_id`(`resume_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resume_infos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NULL,
    `birthday` TIMESTAMP(3) NOT NULL,
    `phone_number` VARCHAR(20) NULL,
    `email` VARCHAR(20) NULL,
    `sido` VARCHAR(20) NULL,
    `sigungu` VARCHAR(20) NULL,
    `disability_level` INTEGER NULL,
    `disability_type` VARCHAR(20) NULL,
    `sex` VARCHAR(5) NULL,
    `avatar` VARCHAR(255) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `resume_infos_resume_id_key`(`resume_id`),
    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resumes` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `content` VARCHAR(255) NULL,
    `is_public` BOOLEAN NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `title`(`title`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trainings` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NULL,
    `institute` VARCHAR(100) NULL,
    `started_at` DATETIME(3) NULL,
    `finished_at` DATETIME(3) NULL,
    `content` VARCHAR(300) NULL,
    `resume_id` INTEGER UNSIGNED NOT NULL,

    INDEX `resume_id`(`resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_metas` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `is_verified` BOOLEAN NULL DEFAULT false,
    `type` VARCHAR(10) NULL DEFAULT 'seeker',
    `user_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `user_metas_user_id_key`(`user_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(40) NOT NULL,
    `password` VARCHAR(1000) NULL,
    `salt` VARCHAR(1000) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `awards` ADD CONSTRAINT `awards_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `careers` ADD CONSTRAINT `careers_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `company_histories` ADD CONSTRAINT `company_histories_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companys`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `educations` ADD CONSTRAINT `educations_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `helper_videos` ADD CONSTRAINT `helper_videos_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `introductions` ADD CONSTRAINT `introductions_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jd_details` ADD CONSTRAINT `jd_details_ibfk_1` FOREIGN KEY (`job_description_id`) REFERENCES `job_descriptions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jd_steps` ADD CONSTRAINT `jd_steps_ibfk_1` FOREIGN KEY (`job_description_id`) REFERENCES `job_descriptions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jd_welfares` ADD CONSTRAINT `jd_welfares_ibfk_1` FOREIGN KEY (`job_description_id`) REFERENCES `job_descriptions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jd_work_conditions` ADD CONSTRAINT `jd_work_conditions_ibfk_1` FOREIGN KEY (`job_description_id`) REFERENCES `job_descriptions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `job_descriptions` ADD CONSTRAINT `job_descriptions_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companys`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `my_videos` ADD CONSTRAINT `my_videos_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `portfolios` ADD CONSTRAINT `portfolios_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `preference_jobs` ADD CONSTRAINT `preference_jobs_ibfk_1` FOREIGN KEY (`preference_id`) REFERENCES `preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `preference_locations` ADD CONSTRAINT `preference_locations_ibfk_1` FOREIGN KEY (`preference_id`) REFERENCES `preferences`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `preferences` ADD CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `resume_applyings` ADD CONSTRAINT `resume_applyings_ibfk_3` FOREIGN KEY (`job_description_id`) REFERENCES `job_descriptions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `resume_applyings` ADD CONSTRAINT `resume_applyings_ibfk_2` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `resume_applyings` ADD CONSTRAINT `resume_applyings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `resume_infos` ADD CONSTRAINT `resume_infos_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `resumes` ADD CONSTRAINT `resumes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trainings` ADD CONSTRAINT `trainings_ibfk_1` FOREIGN KEY (`resume_id`) REFERENCES `resumes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_metas` ADD CONSTRAINT `user_metas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
