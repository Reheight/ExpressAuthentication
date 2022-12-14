/*
  Warnings:

  - Changed the type of `birthdate` on the `member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `member` DROP COLUMN `birthdate`,
    ADD COLUMN `birthdate` DATETIME(3) NOT NULL;
