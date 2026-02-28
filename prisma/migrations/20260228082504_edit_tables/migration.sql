/*
  Warnings:

  - You are about to drop the column `status` on the `salesorderitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_customer_id_fkey`;

-- DropIndex
DROP INDEX `Color_color_code_key` ON `Color`;

-- DropIndex
DROP INDEX `Order_customer_id_fkey` ON `Order`;

-- AlterTable
ALTER TABLE `Order` MODIFY `customer_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `SalesOrderItem` DROP COLUMN `status`;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;
