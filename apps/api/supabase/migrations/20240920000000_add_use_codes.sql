-- Add use_codes column to asset_types table
ALTER TABLE public.asset_types
ADD COLUMN use_codes INTEGER[] DEFAULT '{}';

-- Update existing asset types with corresponding use codes
-- Residential: Single-family homes, condos, townhouses, and multi-family properties up to 4 units
UPDATE public.asset_types
SET use_codes = '{365, 366, 367, 369, 372, 373, 376, 377, 380, 382, 383, 384, 385, 386, 387, 388, 390}'
WHERE name = 'Residential';

-- Multi-Family: Apartment buildings with 5+ units
UPDATE public.asset_types
SET use_codes = '{357, 358, 359, 360, 361, 381}'
WHERE name = 'Multi-Family';

-- Office: Commercial office buildings and spaces
UPDATE public.asset_types
SET use_codes = '{136, 139, 140, 169, 170, 176, 177, 184}'
WHERE name = 'Office';

-- Retail: Retail stores, shopping centers, and malls
UPDATE public.asset_types
SET use_codes = '{124, 125, 128, 130, 141, 143, 144, 145, 151, 158, 167, 178, 179, 183, 188}'
WHERE name = 'Retail';

-- Industrial: Warehouses, manufacturing facilities, and distribution centers
UPDATE public.asset_types
SET use_codes = '{195, 196, 197, 198, 199, 200, 201, 202, 203, 205, 206, 207, 208, 210, 211, 212, 213, 215, 216, 217, 218, 220, 221, 224, 225, 226, 227, 228, 231, 232, 238}'
WHERE name = 'Industrial';

-- Land: Vacant land and development sites
UPDATE public.asset_types
SET use_codes = '{102, 112, 117, 389, 392, 393, 394, 395, 396, 398, 399, 400, 401, 403, 404, 406}'
WHERE name = 'Land';

-- Hospitality: Hotels, motels, and resorts
UPDATE public.asset_types
SET use_codes = '{131, 132, 153, 154, 155, 163, 273}'
WHERE name = 'Hospitality';

-- Storage Unit: Self-storage facilities and storage unit complexes
UPDATE public.asset_types
SET use_codes = '{229, 196, 236, 202, 235, 238, 448, 356}'
WHERE name = 'Storage Unit';


-- Mixed-Use: Properties with multiple uses (e.g., retail on ground floor, residential above)
UPDATE public.asset_types
SET use_codes = '{140, 161, 171, 187}'
WHERE name = 'Mixed-Use';
