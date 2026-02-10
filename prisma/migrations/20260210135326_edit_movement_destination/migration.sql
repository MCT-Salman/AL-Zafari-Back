-- AlterTable
ALTER TABLE `productionorderitem` MODIFY `destination` ENUM('slitting', 'cutting', 'gluing', 'production') NULL;

-- AlterTable
ALTER TABLE `slite` MODIFY `destination` ENUM('slitting', 'cutting', 'gluing', 'production') NULL;

-- AlterTable
ALTER TABLE `warehousemovement` MODIFY `destination` ENUM('slitting', 'cutting', 'gluing', 'production') NULL;
