/*
  Warnings:

  - You are about to alter the column `total_amount` on the `invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(20,2)`.
  - You are about to alter the column `paid_amount` on the `invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(20,2)`.
  - You are about to alter the column `remaining_amount` on the `invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(20,2)`.
  - You are about to alter the column `unit_price` on the `orderitem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `price_per_meter` on the `pricecolor` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.

*/
-- AlterTable
ALTER TABLE `Invoice` MODIFY `total_amount` DECIMAL(20, 2) NOT NULL,
    MODIFY `paid_amount` DECIMAL(20, 2) NOT NULL,
    MODIFY `remaining_amount` DECIMAL(20, 2) NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `unit_price` DECIMAL(20, 2) NULL;

-- AlterTable
ALTER TABLE `PriceColor` MODIFY `price_per_meter` DECIMAL(20, 2) NOT NULL;
