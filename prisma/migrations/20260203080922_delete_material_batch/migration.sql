/*
  Warnings:

  - You are about to drop the column `material_id` on the `batch` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Batch` DROP FOREIGN KEY `Batch_material_id_fkey`;

-- DropIndex
DROP INDEX `Batch_material_id_fkey` ON `Batch`;

-- AlterTable
ALTER TABLE `Batch` DROP COLUMN `material_id`;
