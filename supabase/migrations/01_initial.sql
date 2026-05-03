CREATE TABLE projects ( id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), title TEXT, created_at TIMESTAMPTZ DEFAULT NOW() );
