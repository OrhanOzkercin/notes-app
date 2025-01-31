-- Drop existing tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop the schema_migrations table (used by golang-migrate)
DROP TABLE IF EXISTS schema_migrations; 