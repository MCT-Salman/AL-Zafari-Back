/*
  Warnings:

  - You are about to drop the column `constant_thickness` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the column `constant_width` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the column `ruler_id` on the `orderitem` table. All the data in the column will be lost.
  - You are about to alter the column `type_item` on the `orderitem` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(8))`.
  - You are about to alter the column `type_item` on the `productionorder` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(8))`.
  - You are about to drop the column `constant_width` on the `productionorderitem` table. All the data in the column will be lost.
  - You are about to drop the column `ruler_id` on the `warehousemovement` table. All the data in the column will be lost.
  - Added the required column `color_id` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thickness` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `ProductionOrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_id` to the `WarehouseMovement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_ruler_id_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_type_item_fkey`;

-- DropForeignKey
ALTER TABLE `ProductionOrder` DROP FOREIGN KEY `ProductionOrder_type_item_fkey`;

-- DropForeignKey
ALTER TABLE `WarehouseMovement` DROP FOREIGN KEY `WarehouseMovement_ruler_id_fkey`;

-- DropIndex
DROP INDEX `OrderItem_ruler_id_fkey` ON `OrderItem`;

-- DropIndex
DROP INDEX `OrderItem_type_item_fkey` ON `OrderItem`;

-- DropIndex
DROP INDEX `ProductionOrder_type_item_fkey` ON `ProductionOrder`;

-- DropIndex
DROP INDEX `WarehouseMovement_ruler_id_fkey` ON `WarehouseMovement`;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `constant_thickness`,
    DROP COLUMN `constant_width`,
    DROP COLUMN `ruler_id`,
    ADD COLUMN `color_id` INTEGER NOT NULL,
    ADD COLUMN `thickness` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `width` DECIMAL(10, 2) NOT NULL,
    MODIFY `type_item` ENUM('Presser', 'Machine') NULL;

-- AlterTable
ALTER TABLE `ProductionOrder` MODIFY `type_item` ENUM('Presser', 'Machine') NOT NULL;

-- AlterTable
ALTER TABLE `ProductionOrderItem` DROP COLUMN `constant_width`,
    ADD COLUMN `width` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `WarehouseMovement` DROP COLUMN `ruler_id`,
    ADD COLUMN `color_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarehouseMovement` ADD CONSTRAINT `WarehouseMovement_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
