-- Trello Clone Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Boards table
CREATE TABLE boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    background_color VARCHAR(7) DEFAULT '#0079bf',
    background_image TEXT,
    is_starred BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Board members (many-to-many)
CREATE TABLE board_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(board_id, user_id)
);

-- Lists table
CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cards table
CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    due_date TIMESTAMP,
    cover_image TEXT,
    is_archived BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Labels table
CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    name VARCHAR(100),
    color VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Card labels (many-to-many)
CREATE TABLE card_labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(card_id, label_id)
);

-- Card members (many-to-many)
CREATE TABLE card_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(card_id, user_id)
);

-- Checklists table
CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Checklist items table
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID REFERENCES checklists(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attachments table
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity log table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_boards_created_by ON boards(created_by);
CREATE INDEX idx_lists_board_id ON lists(board_id);
CREATE INDEX idx_lists_position ON lists(board_id, position);
CREATE INDEX idx_cards_list_id ON cards(list_id);
CREATE INDEX idx_cards_position ON cards(list_id, position);
CREATE INDEX idx_cards_archived ON cards(is_archived);
CREATE INDEX idx_labels_board_id ON labels(board_id);
CREATE INDEX idx_card_labels_card_id ON card_labels(card_id);
CREATE INDEX idx_card_members_card_id ON card_members(card_id);
CREATE INDEX idx_checklists_card_id ON checklists(card_id);
CREATE INDEX idx_checklist_items_checklist_id ON checklist_items(checklist_id);
CREATE INDEX idx_comments_card_id ON comments(card_id);
CREATE INDEX idx_attachments_card_id ON attachments(card_id);
CREATE INDEX idx_activities_board_id ON activities(board_id);
CREATE INDEX idx_activities_card_id ON activities(card_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at BEFORE UPDATE ON checklist_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
