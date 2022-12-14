/*
  Warnings:

  - A unique constraint covering the columns `[emailAddress]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthdate` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailAddress` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privacyAgree` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tosAgree` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `member` ADD COLUMN `birthdate` BOOLEAN NOT NULL,
    ADD COLUMN `emailAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `privacyAgree` BOOLEAN NOT NULL,
    ADD COLUMN `tosAgree` BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Member_emailAddress_key` ON `Member`(`emailAddress`);
