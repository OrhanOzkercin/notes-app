#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Execute the cleanup script
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f scripts/cleanup_db.sql

echo "Database cleaned up successfully!" 