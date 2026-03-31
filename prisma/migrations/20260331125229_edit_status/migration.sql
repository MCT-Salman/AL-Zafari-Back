-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('pending', 'preparing', 'canceled', 'outofwarehouse', 'completed') NOT NULL;
