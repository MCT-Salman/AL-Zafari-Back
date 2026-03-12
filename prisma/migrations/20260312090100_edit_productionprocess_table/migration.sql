/*
  Warnings:

  - You are about to drop the column `orderItemOrder_item_id` on the `productionprocess` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProductionProcess` DROP FOREIGN KEY `ProductionProcess_orderItemOrder_item_id_fkey`;

-- DropIndex
DROP INDEX `ProductionProcess_orderItemOrder_item_id_fkey` ON `ProductionProcess`;

-- AlterTable
ALTER TABLE `ProductionProcess` DROP COLUMN `orderItemOrder_item_id`;

-- AddForeignKey
ALTER TABLE `ProductionProcess` ADD CONSTRAINT `ProductionProcess_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionProcess` ADD CONSTRAINT `ProductionProcess_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
