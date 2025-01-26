#!/bin/bash

# Read environment variables from .env file
export $(cat .env | xargs)

# Run the migration
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f internal/infrastructure/repository/postgres/migrations/001_create_users_table.sql 