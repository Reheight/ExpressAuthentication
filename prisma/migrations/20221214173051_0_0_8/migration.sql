-- DropIndex
DROP INDEX `Member_emailAddress_key` ON `member`;

-- DropIndex
DROP INDEX `Member_username_key` ON `member`;

-- AlterTable
ALTER TABLE `member` MODIFY `username` MEDIUMTEXT NOT NULL,
    MODIFY `avatar` TEXT NULL,
    MODIFY `password` TEXT NOT NULL,
    MODIFY `emailAddress` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `MemberRole` (
    `id` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `roleId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `weight` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Role_weight_key`(`weight`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MemberRole` ADD CONSTRAINT `MemberRole_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberRole` ADD CONSTRAINT `MemberRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
