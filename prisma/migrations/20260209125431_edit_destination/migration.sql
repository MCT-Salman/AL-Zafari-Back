-- AlterTable
ALTER TABLE `ProductionOrderItem` MODIFY `source` ENUM('warehouse', 'slitting', 'cutting', 'production') NULL,
    MODIFY `destination` ENUM('slitting', 'cutting', 'production') NULL;

-- AlterTable
ALTER TABLE `Slite` ADD COLUMN `destination` ENUM('slitting', 'cutting', 'production') NULL;

-- AlterTable
ALTER TABLE `WarehouseMovement` MODIFY `destination` ENUM('slitting', 'cutting', 'production') NULL;
