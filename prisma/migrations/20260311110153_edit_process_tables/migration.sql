/*
  Warnings:

  - You are about to drop the column `barcode` on the `productionprocess` table. All the data in the column will be lost.
  - You are about to drop the column `production_order_item_id` on the `productionprocess` table. All the data in the column will be lost.
  - You are about to drop the column `barcode` on the `slite` table. All the data in the column will be lost.
  - You are about to drop the column `production_order_item_id` on the `slite` table. All the data in the column will be lost.
  - You are about to drop the column `production_order_item_id` on the `warehousemovement` table. All the data in the column will be lost.
  - Added the required column `batch_id` to the `ProductionProcess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_id` to the `ProductionProcess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch_id` to the `Slite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_id` to the `Slite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProductionProcess` DROP FOREIGN KEY `ProductionProcess_production_order_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `Slite` DROP FOREIGN KEY `Slite_production_order_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `WarehouseMovement` DROP FOREIGN KEY `WarehouseMovement_production_order_item_id_fkey`;

-- DropIndex
DROP INDEX `Invoice_customer_id_fkey` ON `Invoice`;

-- DropIndex
DROP INDEX `ProductionProcess_barcode_key` ON `ProductionProcess`;

-- DropIndex
DROP INDEX `ProductionProcess_production_order_item_id_fkey` ON `ProductionProcess`;

-- DropIndex
DROP INDEX `Slite_barcode_key` ON `Slite`;

-- DropIndex
DROP INDEX `Slite_production_order_item_id_fkey` ON `Slite`;

-- DropIndex
DROP INDEX `WarehouseMovement_production_order_item_id_fkey` ON `WarehouseMovement`;

-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `total_amount_doller` DECIMAL(20, 2) NULL,
    MODIFY `customer_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `InvoiceItem` ADD COLUMN `unit_price_doller` DECIMAL(20, 2) NULL;

-- AlterTable
ALTER TABLE `ProductionProcess` DROP COLUMN `barcode`,
    DROP COLUMN `production_order_item_id`,
    ADD COLUMN `batch_id` INTEGER NOT NULL,
    ADD COLUMN `color_id` INTEGER NOT NULL,
    ADD COLUMN `source` ENUM('warehouse', 'slitting', 'cutting', 'production') NULL,
    ADD COLUMN `type_item` ENUM('Presser', 'Machine') NULL,
    MODIFY `output_length` VARCHAR(191) NOT NULL,
    MODIFY `waste` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `Slite` DROP COLUMN `barcode`,
    DROP COLUMN `production_order_item_id`,
    ADD COLUMN `batch_id` INTEGER NOT NULL,
    ADD COLUMN `color_id` INTEGER NOT NULL,
    ADD COLUMN `source` ENUM('warehouse', 'slitting', 'cutting', 'production') NULL,
    ADD COLUMN `type_item` ENUM('Presser', 'Machine') NULL,
    MODIFY `input_length` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `WarehouseMovement` DROP COLUMN `production_order_item_id`,
    MODIFY `quantity` INTEGER NULL,
    MODIFY `thickness` DECIMAL(10, 2) NULL;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;
