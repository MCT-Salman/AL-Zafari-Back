-- AlterTable
ALTER TABLE `Batch` ADD COLUMN `material_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Batch` ADD CONSTRAINT `Batch_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`material_id`) ON DELETE SET NULL ON UPDATE CASCADE;
