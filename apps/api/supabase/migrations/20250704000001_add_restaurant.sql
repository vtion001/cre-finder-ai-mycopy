-- Use codes being added:
-- 128: Bakery
-- 129: Bar/Tavern
-- 146: Fast Food (Drive-thru restaurant, fast food)
-- 148: Restaurant
-- 166: Nightclub (Cocktail lounge)
-- 189: Take-Out Restaurant (Food preparation)
-- 2013: Fast Food Drive-Thru

UPDATE public.asset_types
SET
    use_codes = array_cat(
        use_codes,
        '{128, 129, 146, 148, 166, 189, 2013}'::INTEGER[]
    )
WHERE
    slug = 'retail';

-- Remove duplicates if any exist (using array_agg with DISTINCT)
UPDATE public.asset_types
SET
    use_codes = ARRAY(
        SELECT DISTINCT
            unnest(use_codes)
        ORDER BY 1
    )
WHERE
    slug = 'retail';