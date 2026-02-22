/*
  Warnings:

  - You are about to drop the column `constant_value_id` on the `pricecolor` table. All the data in the column will be lost.
  - Added the required column `type_item` to the `PriceColor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pricecolor` DROP FOREIGN KEY `PriceColor_constant_value_id_fkey`;

-- DropIndex
DROP INDEX `PriceColor_constant_value_id_fkey` ON `pricecolor`;

-- AlterTable
ALTER TABLE `pricecolor` DROP COLUMN `constant_value_id`,
    ADD COLUMN `type_item` ENUM('Presser', 'Machine') NOT NULL;
