-- AlterTable
ALTER TABLE `ProductionOrderItem` MODIFY `destination` ENUM('slitting', 'cutting', 'gluing', 'production') NULL;

-- AlterTable
ALTER TABLE `Slite` MODIFY `destination` ENUM('slitting', 'cutting', 'gluing', 'production') NULL;

-- AlterTable
ALTER TABLE `WarehouseMovement` MODIFY `destination` ENUM('slitting', 'cutting', 'gluing', 'production') NULL;
