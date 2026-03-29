/*
  Warnings:

  - You are about to drop the column `groupId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the `notificationgroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notificationinteraction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userbehavioranalytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `NotificationInteraction` DROP FOREIGN KEY `NotificationInteraction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserBehaviorAnalytics` DROP FOREIGN KEY `UserBehaviorAnalytics_userId_fkey`;

-- DropIndex
DROP INDEX `Notification_groupId_idx` ON `Notification`;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `groupId`,
    DROP COLUMN `readAt`;

-- DropTable
DROP TABLE `NotificationGroup`;

-- DropTable
DROP TABLE `NotificationInteraction`;

-- DropTable
DROP TABLE `UserBehaviorAnalytics`;
