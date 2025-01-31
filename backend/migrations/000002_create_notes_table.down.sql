-- Drop trigger first
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_notes_collaborators;
DROP INDEX IF EXISTS idx_notes_user_id;

-- Drop table
DROP TABLE IF EXISTS notes;
