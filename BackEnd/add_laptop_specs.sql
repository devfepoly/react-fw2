-- Add laptop specification columns to san_pham table for Compare functionality
ALTER TABLE `san_pham`
ADD COLUMN `ram` VARCHAR(50) NULL AFTER `mo_ta`,
ADD COLUMN `cpu` VARCHAR(100) NULL AFTER `ram`,
ADD COLUMN `dia_cung` VARCHAR(50) NULL AFTER `cpu`,
ADD COLUMN `mau_sac` VARCHAR(50) NULL AFTER `dia_cung`,
ADD COLUMN `can_nang` DECIMAL(5,2) NULL AFTER `mau_sac`;
