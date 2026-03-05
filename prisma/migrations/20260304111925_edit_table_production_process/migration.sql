/*
  Warnings:

  - Added the required column `type` to the `ProductionProcess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProductionProcess` ADD COLUMN `destination` ENUM('slitting', 'cutting', 'gluing', 'production') NULL,
    ADD COLUMN `type` ENUM('cutting', 'gluing') NOT NULL;
