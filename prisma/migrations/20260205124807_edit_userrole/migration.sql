-- AlterTable
ALTER TABLE `Users` MODIFY `role` ENUM('admin', 'accountant', 'cashier', 'sales', 'production_manager', 'Warehouse_Keeper', 'Warehouse_Products', 'Dissection_Technician', 'Cutting_Technician', 'Gluing_Technician') NOT NULL;
