-- DropForeignKey
ALTER TABLE `Company` DROP FOREIGN KEY `Company_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `ECard` DROP FOREIGN KEY `ECard_ownerId_fkey`;

-- DropIndex
DROP INDEX `Company_ownerId_key` ON `Company`;

-- DropIndex
DROP INDEX `ECard_ownerId_key` ON `ECard`;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ECard` ADD CONSTRAINT `ECard_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
