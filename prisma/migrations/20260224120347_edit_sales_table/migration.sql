/*
  Warnings:

  - You are about to drop the column `destination` on the `salesorderitem` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `salesorderitem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SalesOrderItem` DROP COLUMN `destination`,
    DROP COLUMN `source`;
