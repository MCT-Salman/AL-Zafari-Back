/*
  Warnings:

  - You are about to drop the column `type` on the `productionorder` table. All the data in the column will be lost.
  - You are about to drop the column `batch_id` on the `productionorderitem` table. All the data in the column will be lost.
  - You are about to drop the column `constant_thickness` on the `productionorderitem` table. All the data in the column will be lost.
  - You are about to drop the column `ruler_id` on the `productionorderitem` table. All the data in the column will be lost.
  - You are about to drop the column `type_item` on the `productionorderitem` table. All the data in the column will be lost.
  - Added the required column `batch_id` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constant_thickness` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constant_width` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ruler_id` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_item` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ProductionOrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ProductionOrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ProductionOrderItem` DROP FOREIGN KEY `ProductionOrderItem_batch_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProductionOrderItem` DROP FOREIGN KEY `ProductionOrderItem_ruler_id_fkey`;

-- DropIndex
DROP INDEX `ProductionOrderItem_batch_id_fkey` ON `ProductionOrderItem`;

-- DropIndex
DROP INDEX `ProductionOrderItem_ruler_id_fkey` ON `ProductionOrderItem`;

-- AlterTable
ALTER TABLE `ProductionOrder` DROP COLUMN `type`,
    ADD COLUMN `batch_id` INTEGER NOT NULL,
    ADD COLUMN `constant_thickness` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `constant_width` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `length` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `ruler_id` INTEGER NOT NULL,
    ADD COLUMN `type_item` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ProductionOrderItem` DROP COLUMN `batch_id`,
    DROP COLUMN `constant_thickness`,
    DROP COLUMN `ruler_id`,
    DROP COLUMN `type_item`,
    ADD COLUMN `quantity` INTEGER NULL,
    ADD COLUMN `status` ENUM('pending', 'preparing', 'canceled', 'completed') NOT NULL,
    ADD COLUMN `type` ENUM('orderproduction', 'warehouse', 'slitting', 'cutting', 'gluing') NOT NULL;

-- AddForeignKey
ALTER TABLE `ProductionOrder` ADD CONSTRAINT `ProductionOrder_type_item_fkey` FOREIGN KEY (`type_item`) REFERENCES `ConstantValue`(`constant_value_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionOrder` ADD CONSTRAINT `ProductionOrder_ruler_id_fkey` FOREIGN KEY (`ruler_id`) REFERENCES `Ruler`(`ruler_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionOrder` ADD CONSTRAINT `ProductionOrder_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
