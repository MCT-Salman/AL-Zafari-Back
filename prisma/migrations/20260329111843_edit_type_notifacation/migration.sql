/*
  Warnings:

  - The values [COURSE_NEW,COURSE_UPDATE,LESSON_NEW,QUIZ_AVAILABLE] on the enum `NotificationGroup_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `groupId` INTEGER NULL,
    ADD COLUMN `readAt` DATETIME(3) NULL,
    MODIFY `type` ENUM('GENERAL', 'SYSTEM', 'ORDER_NEW', 'ORDER_UPDATE', 'ORDER_DELETE', 'INVOICE_NEW', 'INVOICE_UPDATE', 'INVOICE_DELETE', 'INVOICE_PAYMENT', 'CUSTOMER_NEW', 'CUSTOMER_UPDATE', 'PRODUCTION_NEW', 'PRODUCTION_UPDATE', 'WAREHOUSE_MOVEMENT', 'SLITE_NEW', 'SALES_ORDER_NEW', 'SALES_ORDER_UPDATE', 'PRODUCTION_ORDER_NEW', 'PRODUCTION_ORDER_SLITTING', 'PRODUCTION_ORDER_CUTTING', 'PRODUCTION_ORDER_GLUING', 'PRODUCTION_ORDER_WAREHOUSE', 'PRODUCTION_ORDER_PRODUCTION', 'PRODUCTION_ORDER_COMPLETED', 'PRODUCTION_ORDER_UPDATE') NOT NULL DEFAULT 'GENERAL';

-- CreateTable
CREATE TABLE `NotificationGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupKey` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `type` ENUM('GENERAL', 'SYSTEM', 'ORDER_NEW', 'ORDER_UPDATE', 'ORDER_DELETE', 'INVOICE_NEW', 'INVOICE_UPDATE', 'INVOICE_DELETE', 'INVOICE_PAYMENT', 'CUSTOMER_NEW', 'CUSTOMER_UPDATE', 'PRODUCTION_NEW', 'PRODUCTION_UPDATE', 'WAREHOUSE_MOVEMENT', 'SLITE_NEW', 'SALES_ORDER_NEW', 'SALES_ORDER_UPDATE', 'PRODUCTION_ORDER_NEW', 'PRODUCTION_ORDER_SLITTING', 'PRODUCTION_ORDER_CUTTING', 'PRODUCTION_ORDER_GLUING', 'PRODUCTION_ORDER_WAREHOUSE', 'PRODUCTION_ORDER_PRODUCTION', 'PRODUCTION_ORDER_COMPLETED', 'PRODUCTION_ORDER_UPDATE') NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `data` JSON NULL,
    `link` VARCHAR(191) NULL,
    `lastUpdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sentAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NotificationGroup_groupKey_idx`(`groupKey`),
    INDEX `NotificationGroup_expiresAt_idx`(`expiresAt`),
    INDEX `NotificationGroup_sentAt_idx`(`sentAt`),
    UNIQUE INDEX `NotificationGroup_groupKey_key`(`groupKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserBehaviorAnalytics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mostActiveHourStart` INTEGER NULL,
    `mostActiveHourEnd` INTEGER NULL,
    `leastActiveHourStart` INTEGER NULL,
    `leastActiveHourEnd` INTEGER NULL,
    `totalNotifications` INTEGER NOT NULL DEFAULT 0,
    `readNotifications` INTEGER NOT NULL DEFAULT 0,
    `readRate` DOUBLE NOT NULL DEFAULT 0,
    `avgResponseTime` INTEGER NULL,
    `preferredChannel` VARCHAR(191) NOT NULL DEFAULT 'socket',
    `lastCalculated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserBehaviorAnalytics_userId_idx`(`userId`),
    UNIQUE INDEX `UserBehaviorAnalytics_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationInteraction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notificationId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `deviceType` VARCHAR(191) NULL,
    `browser` VARCHAR(191) NULL,
    `responseTime` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NotificationInteraction_notificationId_idx`(`notificationId`),
    INDEX `NotificationInteraction_userId_idx`(`userId`),
    INDEX `NotificationInteraction_action_idx`(`action`),
    INDEX `NotificationInteraction_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Notification_groupId_idx` ON `Notification`(`groupId`);

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `NotificationGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBehaviorAnalytics` ADD CONSTRAINT `UserBehaviorAnalytics_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationInteraction` ADD CONSTRAINT `NotificationInteraction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
