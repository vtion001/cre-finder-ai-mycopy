-- Add use_codes column to asset_types table
ALTER TABLE public.asset_types ADD COLUMN slug TEXT UNIQUE;

CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";

CREATE OR REPLACE FUNCTION public.slugify("value" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $_$
  -- removes accents (diacritic signs) from a given string --
  with "unaccented" as (
    select unaccent("value") as "value"
  ),
  -- lowercases the string
  "lowercase" as (
    select lower("value") as "value"
    from "unaccented"
  ),
  -- remove single and double quotes
  "removed_quotes" as (
    select regexp_replace("value", '[''"]+', '', 'gi') as "value"
    from "lowercase"
  ),
  -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
  "hyphenated" as (
    select regexp_replace("value", '[^a-z0-9\\-_]+', '-', 'gi') as "value"
    from "removed_quotes"
  ),
  -- trims hyphens('-') if they exist on the head or tail of the string
  "trimmed" as (
    select regexp_replace(regexp_replace("value", '\-+$', ''), '^\-', '') as "value"
    from "hyphenated"
  )
  
  select "value" from "trimmed"
$_$;

ALTER FUNCTION public.slugify("value" "text") OWNER TO "postgres";

GRANT ALL ON FUNCTION public.slugify ("value" "text") TO "anon";

GRANT ALL ON FUNCTION public.slugify ("value" "text") TO "authenticated";

GRANT ALL ON FUNCTION public.slugify ("value" "text") TO "service_role";

CREATE OR REPLACE FUNCTION public.generate_slug_from_name() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin

  new.slug := public.slugify(new.name);

return new;

end$$;

ALTER FUNCTION public.generate_slug_from_name() OWNER TO "postgres";

GRANT ALL ON FUNCTION public.generate_slug_from_name () TO "anon";

GRANT ALL ON FUNCTION public.generate_slug_from_name () TO "authenticated";

GRANT ALL ON FUNCTION public.generate_slug_from_name () TO "service_role";

CREATE OR REPLACE TRIGGER generate_asset_type_slug BEFORE INSERT ON public.asset_types FOR EACH ROW EXECUTE FUNCTION public.generate_slug_from_name();

-- rename storage units to self storage
UPDATE public.asset_types
SET
    name = 'Self Storage'
WHERE
    name = 'Storage Unit';

UPDATE public.asset_types
SET
    slug = public.slugify (name)
WHERE
    slug IS NULL;