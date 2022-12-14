-- DropIndex
DROP INDEX `Session_accessToken_key` ON `session`;

-- AlterTable
ALTER TABLE `session` MODIFY `accessToken` TEXT NOT NULL;
