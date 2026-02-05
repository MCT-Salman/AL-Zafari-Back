/*
  Warnings:

  - You are about to drop the column `material_id` on the `batch` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `batch` DROP FOREIGN KEY `Batch_material_id_fkey`;

-- DropIndex
DROP INDEX `Batch_material_id_fkey` ON `batch`;

-- AlterTable
ALTER TABLE `batch` DROP COLUMN `material_id`;
