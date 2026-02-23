-- CreateTable
CREATE TABLE `ExchangeRateLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `oldRate` DECIMAL(10, 2) NOT NULL,
    `newRate` DECIMAL(10, 2) NOT NULL,
    `changedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ExchangeRateLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExchangeRateLog` ADD CONSTRAINT `ExchangeRateLog_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
