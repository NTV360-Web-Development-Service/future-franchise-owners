-- First, convert existing varchar data to jsonb format (Lexical JSON structure)
UPDATE "pages_blocks_about_teaser" 
SET "description" = jsonb_build_object(
  'root', jsonb_build_object(
    'type', 'root',
    'format', '',
    'indent', 0,
    'version', 1,
    'children', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'format', '',
        'indent', 0,
        'version', 1,
        'children', jsonb_build_array(
          jsonb_build_object(
            'type', 'text',
            'format', 0,
            'text', COALESCE("description", ''),
            'mode', 'normal',
            'style', '',
            'detail', 0,
            'version', 1
          )
        ),
        'direction', 'ltr',
        'textFormat', 0
      )
    ),
    'direction', 'ltr'
  )
)::text
WHERE "description" IS NOT NULL AND "description" != '';

-- Now alter the column type
ALTER TABLE "pages_blocks_about_teaser" 
ALTER COLUMN "description" 
SET DATA TYPE jsonb 
USING "description"::jsonb;

-- Drop the default value
ALTER TABLE "pages_blocks_about_teaser" 
ALTER COLUMN "description" 
DROP DEFAULT;
