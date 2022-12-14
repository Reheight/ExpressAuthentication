/*
  Warnings:

  - You are about to drop the column `accessExpire` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `refreshExpire` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Session_refreshToken_key` ON `session`;

-- AlterTable
ALTER TABLE `session` DROP COLUMN `accessExpire`,
    DROP COLUMN `refreshExpire`,
    DROP COLUMN `refreshToken`;
