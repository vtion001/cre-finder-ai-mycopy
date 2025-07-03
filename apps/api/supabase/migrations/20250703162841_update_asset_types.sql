-- Update retail asset type with comprehensive use codes
UPDATE public.asset_types
SET
    use_codes = '{124, 125, 127, 141, 158, 167, 168, 178, 179, 183, 187, 188, 194, 307, 459}'
WHERE
    slug = 'retail';

-- Insert new asset types based on property use code categories
INSERT INTO
    public.asset_types (name, description, use_codes)
VALUES (
        'Lodging',
        'Hotels, motels, bed & breakfasts, and other transient lodging facilities',
        '{131, 153, 154, 155, 163, 299}'
    ),
    (
        'Parking & Transit',
        'Parking facilities, transportation hubs, and transit-related properties',
        '{172, 174, 258, 265, 291, 300, 349, 418}'
    ),
    (
        'Other',
        'Auto repair, medical, professional services, and other commercial service properties',
        '{126, 142, 145, 147, 156, 157, 173, 175, 177, 180, 185, 186, 190, 191, 192, 193, 204, 296, 311, 312, 412, 458, 464}'
    );