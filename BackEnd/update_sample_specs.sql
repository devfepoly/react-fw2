-- Update sample laptop specifications for existing products
-- This adds sample data for RAM, CPU, Disk, Color, and Weight

-- Update first 50 products with sample specs
UPDATE san_pham SET 
  ram = '8GB DDR4',
  cpu = 'Intel Core i5-1155G7',
  dia_cung = '256GB SSD',
  mau_sac = 'Bạc',
  can_nang = 1.5
WHERE id BETWEEN 1 AND 10;

UPDATE san_pham SET 
  ram = '16GB DDR4',
  cpu = 'Intel Core i7-11800H',
  dia_cung = '512GB SSD',
  mau_sac = 'Đen',
  can_nang = 2.1
WHERE id BETWEEN 11 AND 20;

UPDATE san_pham SET 
  ram = '8GB DDR4',
  cpu = 'AMD Ryzen 5 5500U',
  dia_cung = '256GB SSD',
  mau_sac = 'Xám',
  can_nang = 1.7
WHERE id BETWEEN 21 AND 30;

UPDATE san_pham SET 
  ram = '16GB DDR5',
  cpu = 'Intel Core i7-12700H',
  dia_cung = '1TB SSD',
  mau_sac = 'Xanh',
  can_nang = 2.3
WHERE id BETWEEN 31 AND 40;

UPDATE san_pham SET 
  ram = '8GB DDR4',
  cpu = 'Intel Core i3-N4020',
  dia_cung = '128GB SSD',
  mau_sac = 'Trắng',
  can_nang = 1.3
WHERE id BETWEEN 41 AND 50;

UPDATE san_pham SET 
  ram = '32GB DDR4',
  cpu = 'Intel Core i9-11900H',
  dia_cung = '1TB SSD',
  mau_sac = 'Đỏ',
  can_nang = 2.5
WHERE id BETWEEN 51 AND 60;

UPDATE san_pham SET 
  ram = '16GB DDR4',
  cpu = 'AMD Ryzen 7 5800H',
  dia_cung = '512GB SSD',
  mau_sac = 'Bạc',
  can_nang = 2.0
WHERE id BETWEEN 61 AND 70;

UPDATE san_pham SET 
  ram = '8GB DDR4',
  cpu = 'Intel Core i5-10300H',
  dia_cung = '512GB SSD',
  mau_sac = 'Đen',
  can_nang = 1.8
WHERE id BETWEEN 71 AND 80;

UPDATE san_pham SET 
  ram = '16GB DDR5',
  cpu = 'Intel Core i7-1360P',
  dia_cung = '512GB SSD',
  mau_sac = 'Xám',
  can_nang = 1.6
WHERE id BETWEEN 81 AND 90;

UPDATE san_pham SET 
  ram = '8GB DDR4',
  cpu = 'Intel Celeron N4120',
  dia_cung = '256GB eMMC',
  mau_sac = 'Xanh',
  can_nang = 1.4
WHERE id BETWEEN 91 AND 100;

-- Continue updating more products with varied specs
UPDATE san_pham SET 
  ram = '16GB DDR4',
  cpu = 'AMD Ryzen 5 4600H',
  dia_cung = '512GB SSD',
  mau_sac = 'Đen',
  can_nang = 1.9
WHERE id > 100 AND ram IS NULL;

-- Update Apple products with M-series chips
UPDATE san_pham SET 
  ram = '8GB Unified',
  cpu = 'Apple M2',
  dia_cung = '256GB SSD',
  mau_sac = 'Bạc',
  can_nang = 1.4
WHERE ten_sp LIKE '%MacBook%' AND ram IS NULL;
