-- Create extension for unaccent functionality
CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "public";

-- Create slugify function
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

-- Set function ownership and permissions
ALTER FUNCTION public.slugify("value" "text") OWNER TO "postgres";

GRANT ALL ON FUNCTION public.slugify ("value" "text") TO "anon";

GRANT ALL ON FUNCTION public.slugify ("value" "text") TO "authenticated";

GRANT ALL ON FUNCTION public.slugify ("value" "text") TO "service_role";

-- Create slug generation trigger function
CREATE OR REPLACE FUNCTION public.generate_slug_from_name() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
  new.slug := public.slugify(new.name);

return new;

end$$;

-- Set function ownership and permissions
ALTER FUNCTION public.generate_slug_from_name() OWNER TO "postgres";

GRANT ALL ON FUNCTION public.generate_slug_from_name () TO "anon";

GRANT ALL ON FUNCTION public.generate_slug_from_name () TO "authenticated";

GRANT ALL ON FUNCTION public.generate_slug_from_name () TO "service_role";