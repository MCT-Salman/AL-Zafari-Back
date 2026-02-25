/*
  Warnings:

  - You are about to drop the column `length` on the `productionorder` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `productionorder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProductionOrder` DROP FOREIGN KEY `ProductionOrder_batch_id_fkey`;

-- DropIndex
DROP INDEX `ProductionOrder_batch_id_fkey` ON `ProductionOrder`;

-- AlterTable
ALTER TABLE `ProductionOrder` DROP COLUMN `length`,
    DROP COLUMN `width`,
    MODIFY `batch_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `ProductionProcess` ADD COLUMN `salesOrderItemSales_order_item_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `Slite` ADD COLUMN `salesOrderItemSales_order_item_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `WarehouseMovement` ADD COLUMN `salesOrderItemSales_order_item_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `InvoiceItem` (
    `invoice_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoice_id` INTEGER NOT NULL,
    `order_item_id` INTEGER NOT NULL,
    `width` DECIMAL(10, 2) NOT NULL,
    `length` DECIMAL(10, 2) NOT NULL,
    `unit_price` DECIMAL(20, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `subtotal` DECIMAL(20, 2) NOT NULL,

    PRIMARY KEY (`invoice_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesOrder` (
    `sales_order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `issued_by` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `status` ENUM('pending', 'preparing', 'canceled', 'completed') NOT NULL,

    INDEX `SalesOrder_created_at_idx`(`created_at`),
    INDEX `SalesOrder_status_idx`(`status`),
    INDEX `SalesOrder_created_at_status_idx`(`created_at`, `status`),
    PRIMARY KEY (`sales_order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesOrderItem` (
    `sales_order_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `sales_order_id` INTEGER NOT NULL,
    `color_id` INTEGER NOT NULL,
    `batch_id` INTEGER NULL,
    `type_item` ENUM('Presser', 'Machine') NOT NULL,
    `width` DECIMAL(10, 2) NOT NULL,
    `length` DECIMAL(10, 2) NOT NULL,
    `thickness` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NULL,
    `source` ENUM('warehouse', 'slitting', 'cutting', 'production') NULL,
    `destination` ENUM('slitting', 'cutting', 'gluing', 'production') NULL,
    `status` ENUM('pending', 'preparing', 'canceled', 'completed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`sales_order_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `Invoice`(`invoice_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_order_item_id_fkey` FOREIGN KEY (`order_item_id`) REFERENCES `OrderItem`(`order_item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_issued_by_fkey` FOREIGN KEY (`issued_by`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderItem` ADD CONSTRAINT `SalesOrderItem_sales_order_id_fkey` FOREIGN KEY (`sales_order_id`) REFERENCES `SalesOrder`(`sales_order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionOrder` ADD CONSTRAINT `ProductionOrder_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionProcess` ADD CONSTRAINT `ProductionProcess_salesOrderItemSales_order_item_id_fkey` FOREIGN KEY (`salesOrderItemSales_order_item_id`) REFERENCES `SalesOrderItem`(`sales_order_item_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Slite` ADD CONSTRAINT `Slite_salesOrderItemSales_order_item_id_fkey` FOREIGN KEY (`salesOrderItemSales_order_item_id`) REFERENCES `SalesOrderItem`(`sales_order_item_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarehouseMovement` ADD CONSTRAINT `WarehouseMovement_salesOrderItemSales_order_item_id_fkey` FOREIGN KEY (`salesOrderItemSales_order_item_id`) REFERENCES `SalesOrderItem`(`sales_order_item_id`) ON DELETE SET NULL ON UPDATE CASCADE;
