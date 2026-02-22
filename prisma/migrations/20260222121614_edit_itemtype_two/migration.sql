/*
  Warnings:

  - You are about to drop the column `constant_thickness` on the `productionorder` table. All the data in the column will be lost.
  - You are about to drop the column `constant_width` on the `productionorder` table. All the data in the column will be lost.
  - You are about to drop the column `ruler_id` on the `productionorder` table. All the data in the column will be lost.
  - Added the required column `color_id` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thickness` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `productionorder` DROP FOREIGN KEY `ProductionOrder_ruler_id_fkey`;

-- DropIndex
DROP INDEX `ProductionOrder_ruler_id_fkey` ON `productionorder`;

-- AlterTable
ALTER TABLE `productionorder` DROP COLUMN `constant_thickness`,
    DROP COLUMN `constant_width`,
    DROP COLUMN `ruler_id`,
    ADD COLUMN `color_id` INTEGER NOT NULL,
    ADD COLUMN `thickness` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `width` DECIMAL(10, 2) NOT NULL;

-- AddForeignKey
ALTER TABLE `ProductionOrder` ADD CONSTRAINT `ProductionOrder_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
