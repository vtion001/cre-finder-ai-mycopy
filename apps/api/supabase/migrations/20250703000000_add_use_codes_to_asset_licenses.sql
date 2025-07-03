-- Add use_codes number array column to asset_licenses table
-- This column will store an array of property use codes for filtering search results

ALTER TABLE asset_licenses ADD COLUMN use_codes INTEGER[];

-- Add index for use_codes column to optimize queries
CREATE INDEX idx_asset_licenses_use_codes ON asset_licenses USING GIN (use_codes);