/*
  Warnings:

  - You are about to drop the column `salesOrderItemSales_order_item_id` on the `productionprocess` table. All the data in the column will be lost.
  - You are about to drop the column `salesOrderItemSales_order_item_id` on the `slite` table. All the data in the column will be lost.
  - You are about to drop the column `salesOrderItemSales_order_item_id` on the `warehousemovement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProductionProcess` DROP FOREIGN KEY `ProductionProcess_salesOrderItemSales_order_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `Slite` DROP FOREIGN KEY `Slite_salesOrderItemSales_order_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `WarehouseMovement` DROP FOREIGN KEY `WarehouseMovement_salesOrderItemSales_order_item_id_fkey`;

-- DropIndex
DROP INDEX `ProductionProcess_salesOrderItemSales_order_item_id_fkey` ON `ProductionProcess`;

-- DropIndex
DROP INDEX `Slite_salesOrderItemSales_order_item_id_fkey` ON `Slite`;

-- DropIndex
DROP INDEX `WarehouseMovement_salesOrderItemSales_order_item_id_fkey` ON `WarehouseMovement`;

-- AlterTable
ALTER TABLE `ProductionProcess` DROP COLUMN `salesOrderItemSales_order_item_id`;

-- AlterTable
ALTER TABLE `Slite` DROP COLUMN `salesOrderItemSales_order_item_id`;

-- AlterTable
ALTER TABLE `WarehouseMovement` DROP COLUMN `salesOrderItemSales_order_item_id`;
