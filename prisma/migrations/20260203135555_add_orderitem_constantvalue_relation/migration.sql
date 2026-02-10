-- AlterTable
ALTER TABLE `OrderItem` MODIFY `type_item` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_type_item_fkey` FOREIGN KEY (`type_item`) REFERENCES `ConstantValue`(`constant_value_id`) ON DELETE SET NULL ON UPDATE CASCADE;
