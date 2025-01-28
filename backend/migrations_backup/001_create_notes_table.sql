-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    -- Primary key using UUID for better distribution and security
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic note fields
    title VARCHAR(255) NOT NULL,
    content_json TEXT NOT NULL,  -- Stores the rich text content as JSON
    html_snapshot TEXT NOT NULL, -- Stores rendered HTML for quick previews
    
    -- Version control
    version INTEGER NOT NULL DEFAULT 1,
    
    -- Ownership and collaboration
    user_id UUID NOT NULL,       -- Who created the note
    collaborators UUID[] DEFAULT '{}',  -- Array of user IDs who can access this note
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key to users table
    CONSTRAINT fk_notes_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster queries by user_id
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Create index for collaborator lookups
CREATE INDEX idx_notes_collaborators ON notes USING gin(collaborators);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 