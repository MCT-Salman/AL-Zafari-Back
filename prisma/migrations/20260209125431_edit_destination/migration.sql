-- AlterTable
ALTER TABLE `productionorderitem` MODIFY `source` ENUM('warehouse', 'slitting', 'cutting', 'production') NULL,
    MODIFY `destination` ENUM('slitting', 'cutting', 'production') NULL;

-- AlterTable
ALTER TABLE `slite` ADD COLUMN `destination` ENUM('slitting', 'cutting', 'production') NULL;

-- AlterTable
ALTER TABLE `warehousemovement` MODIFY `destination` ENUM('slitting', 'cutting', 'production') NULL;
