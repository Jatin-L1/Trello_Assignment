# Supabase Setup Instructions

## Your Supabase Project Details

- **Project URL**: https://nwqktzqgmssgorrghfmd.supabase.co
- **Database Password**: OAET22cN

## Step-by-Step Setup

### 1. Access Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: `nwqktzqgmssgorrghfmd`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### 2. Run Database Schema

Copy the ENTIRE contents of `backend/database/schema.sql` and paste it into the SQL Editor, then click "Run".

**What this does:**
- Creates 13 tables (users, boards, lists, cards, labels, etc.)
- Sets up foreign key relationships
- Creates indexes for performance
- Adds triggers for automatic timestamps

**Expected Result:** You should see "Success. No rows returned"

### 3. Run Seed Data

Create another new query, copy the ENTIRE contents of `backend/database/seed.sql` and paste it, then click "Run".

**What this does:**
- Adds 4 sample users
- Creates 3 sample boards
- Adds lists and cards with sample data
- Includes labels, checklists, and comments

**Expected Result:** You should see "Success. No rows returned"

### 4. Verify Database Setup

Go to "Table Editor" in the left sidebar and verify these tables exist:
- ✅ users (should have 4 rows)
- ✅ boards (should have 3 rows)
- ✅ lists (should have multiple rows)
- ✅ cards (should have multiple rows)
- ✅ labels
- ✅ card_labels
- ✅ card_members
- ✅ checklists
- ✅ checklist_items
- ✅ comments
- ✅ attachments
- ✅ activities
- ✅ board_members

### 5. Check Connection String

Your connection string is already configured in `backend/.env`:
```
DATABASE_URL=postgresql://postgres.nwqktzqgmssgorrghfmd:OAET22cN@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Troubleshooting

### If schema.sql fails:
1. Check if tables already exist
2. Drop all tables and try again
3. Run each CREATE TABLE statement individually

### If seed.sql fails:
1. Make sure schema.sql ran successfully first
2. Check for UUID conflicts
3. Run INSERT statements individually

### Connection Issues:
1. Verify your project is active in Supabase dashboard
2. Check if the password is correct
3. Ensure you're using the pooler connection string (port 6543)

## Next Steps

After completing the database setup:
1. Install dependencies: `cd backend && npm install`
2. Start backend: `npm run dev`
3. In another terminal: `cd frontend && npm install`
4. Start frontend: `npm run dev`
5. Open http://localhost:3000
