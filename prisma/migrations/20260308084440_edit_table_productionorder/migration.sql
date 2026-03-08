/*
  Warnings:

  - You are about to drop the column `batch_id` on the `productionorder` table. All the data in the column will be lost.
  - You are about to drop the column `color_id` on the `productionorder` table. All the data in the column will be lost.
  - You are about to drop the column `thickness` on the `productionorder` table. All the data in the column will be lost.
  - You are about to drop the column `type_item` on the `productionorder` table. All the data in the column will be lost.
  - Added the required column `color_id` to the `ProductionOrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thickness` to the `ProductionOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProductionOrder` DROP FOREIGN KEY `ProductionOrder_batch_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProductionOrder` DROP FOREIGN KEY `ProductionOrder_color_id_fkey`;

-- DropIndex
DROP INDEX `ProductionOrder_batch_id_fkey` ON `ProductionOrder`;

-- DropIndex
DROP INDEX `ProductionOrder_color_id_fkey` ON `ProductionOrder`;

-- AlterTable
ALTER TABLE `ProductionOrder` DROP COLUMN `batch_id`,
    DROP COLUMN `color_id`,
    DROP COLUMN `thickness`,
    DROP COLUMN `type_item`;

-- AlterTable
ALTER TABLE `ProductionOrderItem` ADD COLUMN `batch_id` INTEGER NULL,
    ADD COLUMN `color_id` INTEGER NOT NULL,
    ADD COLUMN `thickness` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `type_item` ENUM('Presser', 'Machine') NULL;

-- AddForeignKey
ALTER TABLE `ProductionOrderItem` ADD CONSTRAINT `ProductionOrderItem_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionOrderItem` ADD CONSTRAINT `ProductionOrderItem_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE SET NULL ON UPDATE CASCADE;
