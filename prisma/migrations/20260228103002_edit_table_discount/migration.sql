/*
  Warnings:

  - Added the required column `material_id` to the `Discount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_batch_id_fkey`;

-- DropIndex
DROP INDEX `OrderItem_batch_id_fkey` ON `OrderItem`;

-- AlterTable
ALTER TABLE `Discount` ADD COLUMN `material_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `batch_id` INTEGER NULL,
    MODIFY `thickness` DECIMAL(10, 2) NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`material_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
