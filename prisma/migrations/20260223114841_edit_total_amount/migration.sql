/*
  Warnings:

  - You are about to alter the column `total_amount` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(20,2)`.
  - You are about to alter the column `subtotal` on the `orderitem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(20,2)`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `total_amount` DECIMAL(20, 2) NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `subtotal` DECIMAL(20, 2) NOT NULL;
