/*
  Warnings:

  - You are about to drop the column `order_item_id` on the `invoiceitem` table. All the data in the column will be lost.
  - Added the required column `discount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_id` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `InvoiceItem` DROP FOREIGN KEY `InvoiceItem_order_item_id_fkey`;

-- DropIndex
DROP INDEX `Invoice_order_id_fkey` ON `Invoice`;

-- DropIndex
DROP INDEX `InvoiceItem_order_item_id_fkey` ON `InvoiceItem`;

-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `discount` DECIMAL(20, 2) NOT NULL,
    MODIFY `order_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `InvoiceItem` DROP COLUMN `order_item_id`,
    ADD COLUMN `batch_id` INTEGER NULL,
    ADD COLUMN `color_id` INTEGER NOT NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `thickness` DECIMAL(10, 2) NULL,
    ADD COLUMN `type_item` ENUM('Presser', 'Machine') NULL,
    MODIFY `width` DECIMAL(10, 2) NULL,
    MODIFY `length` DECIMAL(10, 2) NULL,
    MODIFY `unit_price` DECIMAL(20, 2) NULL;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE SET NULL ON UPDATE CASCADE;
