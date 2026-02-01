-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'accountant', 'sales', 'Warehouse_Keeper', 'Warehouse_Products', 'Dissection_Technician', 'Cutting_Technician', 'Gluing_Technician') NOT NULL,
    `country` VARCHAR(191) NULL,
    `countryCode` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `currentSessionId` VARCHAR(191) NULL,
    `fcmToken` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_phone_key`(`phone`),
    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_currentSessionId_key`(`currentSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `userAgent` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `realIp` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `deviceInfo` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `revokedAt` DATETIME(3) NULL,

    INDEX `Session_userId_idx`(`userId`),
    INDEX `Session_realIp_idx`(`realIp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tokenHash` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `isRevoked` BOOLEAN NOT NULL DEFAULT false,
    `revokedAt` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `RefreshToken_tokenHash_key`(`tokenHash`),
    INDEX `RefreshToken_userId_idx`(`userId`),
    INDEX `RefreshToken_sessionId_idx`(`sessionId`),
    INDEX `RefreshToken_tokenHash_idx`(`tokenHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginAttempt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `ip` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NULL,
    `success` BOOLEAN NOT NULL DEFAULT false,
    `failureReason` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoginAttempt_identifier_idx`(`identifier`),
    INDEX `LoginAttempt_ip_idx`(`ip`),
    INDEX `LoginAttempt_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `type` ENUM('GENERAL', 'COURSE_NEW', 'COURSE_UPDATE', 'LESSON_NEW', 'QUIZ_AVAILABLE', 'SYSTEM') NOT NULL DEFAULT 'GENERAL',
    `data` JSON NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `link` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `sentToFCM` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_created_at_idx`(`created_at`),
    INDEX `Notification_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `actorId` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `resource` VARCHAR(191) NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `action` ENUM('SEARCH', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT') NOT NULL,
    `module` VARCHAR(191) NOT NULL,
    `entityId` INTEGER NULL,
    `entityRef` VARCHAR(191) NULL,
    `searchQuery` VARCHAR(191) NULL,
    `oldData` JSON NULL,
    `newData` JSON NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ActivityLog_userId_idx`(`userId`),
    INDEX `ActivityLog_action_idx`(`action`),
    INDEX `ActivityLog_module_idx`(`module`),
    INDEX `ActivityLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RateLimit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `windowEnd` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RateLimit_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `customer_type` ENUM('Branch', 'agent', 'customer') NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NULL,
    `countryCode` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `fcmToken` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Material` (
    `material_id` INTEGER NOT NULL AUTO_INCREMENT,
    `material_name` VARCHAR(191) NOT NULL,
    `type` ENUM('Role', 'Blanck') NOT NULL,
    `constant_height_id` INTEGER NULL,
    `constant_width_id` INTEGER NULL,
    `constant_thickness_id` INTEGER NULL,
    `constant_value_unit` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`material_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ruler` (
    `ruler_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ruler_type` ENUM('old', 'new') NOT NULL,
    `material_id` INTEGER NOT NULL,
    `color_id` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`ruler_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Color` (
    `color_id` INTEGER NOT NULL AUTO_INCREMENT,
    `material_id` INTEGER NOT NULL,
    `color_code` VARCHAR(191) NOT NULL,
    `color_name` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NULL,

    UNIQUE INDEX `Color_color_code_key`(`color_code`),
    PRIMARY KEY (`color_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceColor` (
    `price_color_id` INTEGER NOT NULL AUTO_INCREMENT,
    `color_id` INTEGER NOT NULL,
    `constant_value_id` INTEGER NOT NULL,
    `price_color_By` ENUM('isByMeter22', 'isByMeter44', 'isByMeter66', 'isByBlanck') NOT NULL,
    `price_per_meter` DECIMAL(10, 2) NOT NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`price_color_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConstantType` (
    `constant_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `constants_Type_name` VARCHAR(191) NOT NULL,
    `type` ENUM('width', 'height', 'thickness', 'type_order', 'source_order') NOT NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`constant_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConstantValue` (
    `constant_value_id` INTEGER NOT NULL AUTO_INCREMENT,
    `constant_type_id` INTEGER NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`constant_value_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Batch` (
    `batch_id` INTEGER NOT NULL AUTO_INCREMENT,
    `batch_number` VARCHAR(191) NOT NULL,
    `entry_date` DATETIME(3) NOT NULL,
    `material_id` INTEGER NOT NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`batch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `sales_user_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'preparing', 'canceled', 'completed') NOT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,

    INDEX `Order_status_idx`(`status`),
    INDEX `Order_created_at_idx`(`created_at`),
    INDEX `Order_status_created_at_idx`(`status`, `created_at`),
    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `order_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `type_item` INTEGER NOT NULL,
    `ruler_id` INTEGER NOT NULL,
    `constant_width` DECIMAL(10, 2) NOT NULL,
    `length` DECIMAL(10, 2) NOT NULL,
    `constant_thickness` DECIMAL(10, 2) NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`order_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `invoice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL,
    `paid_amount` DECIMAL(12, 2) NOT NULL,
    `remaining_amount` DECIMAL(12, 2) NOT NULL,
    `issued_by` INTEGER NOT NULL,
    `issued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`invoice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductionOrder` (
    `production_order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `issued_by` INTEGER NOT NULL,
    `type` ENUM('orderproduction', 'warehouse', 'slitting', 'cutting', 'gluing') NOT NULL,
    `status` ENUM('pending', 'preparing', 'canceled', 'completed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,

    INDEX `ProductionOrder_created_at_idx`(`created_at`),
    INDEX `ProductionOrder_status_idx`(`status`),
    INDEX `ProductionOrder_created_at_status_idx`(`created_at`, `status`),
    PRIMARY KEY (`production_order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductionOrderItem` (
    `production_order_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_order_id` INTEGER NOT NULL,
    `type_item` INTEGER NOT NULL,
    `constant_width` DECIMAL(10, 2) NOT NULL,
    `length` DECIMAL(10, 2) NOT NULL,
    `constant_thickness` DECIMAL(10, 2) NOT NULL,
    `ruler_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `source` ENUM('warehouse', 'slitting', 'cutting', 'production') NOT NULL,
    `destination` ENUM('slitting', 'cutting', 'production') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`production_order_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductionProcess` (
    `process_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_order_item_id` INTEGER NOT NULL,
    `input_length` DECIMAL(10, 2) NOT NULL,
    `output_length` DECIMAL(10, 2) NOT NULL,
    `input_width` DECIMAL(10, 2) NOT NULL,
    `waste` DECIMAL(10, 2) NOT NULL,
    `barcode` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `orderItemOrder_item_id` INTEGER NULL,

    UNIQUE INDEX `ProductionProcess_barcode_key`(`barcode`),
    INDEX `ProductionProcess_created_at_idx`(`created_at`),
    PRIMARY KEY (`process_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Slite` (
    `slite_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_order_item_id` INTEGER NOT NULL,
    `input_length` DECIMAL(10, 2) NOT NULL,
    `output_length` DECIMAL(10, 2) NOT NULL,
    `input_width` DECIMAL(10, 2) NOT NULL,
    `output_length_22` DECIMAL(10, 2) NOT NULL,
    `output_length_44` DECIMAL(10, 2) NOT NULL,
    `barcode` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,

    UNIQUE INDEX `Slite_barcode_key`(`barcode`),
    PRIMARY KEY (`slite_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Increase` (
    `increase` INTEGER NOT NULL AUTO_INCREMENT,
    `slite_id` INTEGER NOT NULL,
    `width` DECIMAL(10, 2) NOT NULL,
    `height` DECIMAL(10, 2) NOT NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`increase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WarehouseMovement` (
    `movement_id` INTEGER NOT NULL AUTO_INCREMENT,
    `production_order_item_id` INTEGER NOT NULL,
    `ruler_id` INTEGER NOT NULL,
    `batch_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `length` DECIMAL(10, 2) NOT NULL,
    `width` DECIMAL(10, 2) NOT NULL,
    `thickness` DECIMAL(10, 2) NOT NULL,
    `destination` ENUM('slitting', 'cutting', 'production') NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,

    INDEX `WarehouseMovement_created_at_idx`(`created_at`),
    PRIMARY KEY (`movement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginAttempt` ADD CONSTRAINT `LoginAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_constant_height_id_fkey` FOREIGN KEY (`constant_height_id`) REFERENCES `ConstantValue`(`constant_value_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_constant_width_id_fkey` FOREIGN KEY (`constant_width_id`) REFERENCES `ConstantValue`(`constant_value_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_constant_thickness_id_fkey` FOREIGN KEY (`constant_thickness_id`) REFERENCES `ConstantValue`(`constant_value_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ruler` ADD CONSTRAINT `Ruler_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`material_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ruler` ADD CONSTRAINT `Ruler_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Color` ADD CONSTRAINT `Color_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`material_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceColor` ADD CONSTRAINT `PriceColor_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `Color`(`color_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceColor` ADD CONSTRAINT `PriceColor_constant_value_id_fkey` FOREIGN KEY (`constant_value_id`) REFERENCES `ConstantValue`(`constant_value_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConstantValue` ADD CONSTRAINT `ConstantValue_constant_type_id_fkey` FOREIGN KEY (`constant_type_id`) REFERENCES `ConstantType`(`constant_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Batch` ADD CONSTRAINT `Batch_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `Material`(`material_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_sales_user_id_fkey` FOREIGN KEY (`sales_user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_ruler_id_fkey` FOREIGN KEY (`ruler_id`) REFERENCES `Ruler`(`ruler_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_issued_by_fkey` FOREIGN KEY (`issued_by`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionOrder` ADD CONSTRAINT `ProductionOrder_issued_by_fkey` FOREIGN KEY (`issued_by`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionOrderItem` ADD CONSTRAINT `ProductionOrderItem_production_order_id_fkey` FOREIGN KEY (`production_order_id`) REFERENCES `ProductionOrder`(`production_order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionOrderItem` ADD CONSTRAINT `ProductionOrderItem_ruler_id_fkey` FOREIGN KEY (`ruler_id`) REFERENCES `Ruler`(`ruler_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionOrderItem` ADD CONSTRAINT `ProductionOrderItem_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionProcess` ADD CONSTRAINT `ProductionProcess_production_order_item_id_fkey` FOREIGN KEY (`production_order_item_id`) REFERENCES `ProductionOrderItem`(`production_order_item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionProcess` ADD CONSTRAINT `ProductionProcess_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductionProcess` ADD CONSTRAINT `ProductionProcess_orderItemOrder_item_id_fkey` FOREIGN KEY (`orderItemOrder_item_id`) REFERENCES `OrderItem`(`order_item_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Slite` ADD CONSTRAINT `Slite_production_order_item_id_fkey` FOREIGN KEY (`production_order_item_id`) REFERENCES `ProductionOrderItem`(`production_order_item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Slite` ADD CONSTRAINT `Slite_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Increase` ADD CONSTRAINT `Increase_slite_id_fkey` FOREIGN KEY (`slite_id`) REFERENCES `Slite`(`slite_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarehouseMovement` ADD CONSTRAINT `WarehouseMovement_production_order_item_id_fkey` FOREIGN KEY (`production_order_item_id`) REFERENCES `ProductionOrderItem`(`production_order_item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarehouseMovement` ADD CONSTRAINT `WarehouseMovement_ruler_id_fkey` FOREIGN KEY (`ruler_id`) REFERENCES `Ruler`(`ruler_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarehouseMovement` ADD CONSTRAINT `WarehouseMovement_batch_id_fkey` FOREIGN KEY (`batch_id`) REFERENCES `Batch`(`batch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WarehouseMovement` ADD CONSTRAINT `WarehouseMovement_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
