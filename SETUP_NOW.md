# 🚀 IMMEDIATE SETUP INSTRUCTIONS

## ⚠️ IMPORTANT: You need to run the SQL scripts in Supabase first!

The backend is running, but the database tables don't exist yet. Follow these steps:

## Step 1: Run Database Schema in Supabase (5 minutes)

### 1.1 Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/nwqktzqgmssgorrghfmd
2. Click "SQL Editor" in the left sidebar
3. Click "New Query" button

### 1.2 Copy and Run Schema
1. Open the file: `backend/database/schema.sql`
2. Copy ALL the contents (Ctrl+A, Ctrl+C)
3. Paste into the Supabase SQL Editor
4. Click "Run" button (or press Ctrl+Enter)
5. Wait for "Success. No rows returned" message

### 1.3 Copy and Run Seed Data
1. Click "New Query" again
2. Open the file: `backend/database/seed.sql`
3. Copy ALL the contents
4. Paste into the Supabase SQL Editor
5. Click "Run" button
6. Wait for "Success. No rows returned" message

### 1.4 Verify Tables Created
1. Click "Table Editor" in the left sidebar
2. You should see these tables:
   - users (4 rows)
   - boards (3 rows)
   - lists (multiple rows)
   - cards (multiple rows)
   - labels
   - card_labels
   - card_members
   - checklists
   - checklist_items
   - comments
   - attachments
   - activities
   - board_members

## Step 2: Test the API

After completing Step 1, run this command:

```bash
node test-api.js
```

You should see all green checkmarks (✅) for each endpoint test.

## Step 3: Start the Frontend

```bash
cd frontend
npm run dev
```

Then open: http://localhost:3000

## Current Status

✅ Backend dependencies installed
✅ Frontend dependencies installed
✅ Backend server running on port 5000
✅ Environment files configured
⏳ **WAITING FOR YOU**: Run SQL scripts in Supabase
⏳ Frontend not started yet

## Quick Copy-Paste for Supabase

### For schema.sql:
Open `backend/database/schema.sql` and copy everything from:
```sql
-- Trello Clone Database Schema
```
to the end of the file.

### For seed.sql:
Open `backend/database/seed.sql` and copy everything from:
```sql
-- Seed data for Trello Clone
```
to the end of the file.

## Troubleshooting

### If you get "Tenant or user not found" error:
- This means the database tables don't exist yet
- Run the schema.sql script in Supabase

### If schema.sql fails:
- Make sure you're in the correct project
- Try running each CREATE TABLE statement individually
- Check if tables already exist (drop them first if needed)

### If seed.sql fails:
- Make sure schema.sql ran successfully first
- Check for any error messages
- Verify the UUIDs don't conflict with existing data

## What Happens Next

Once you complete the Supabase setup:

1. ✅ All API endpoints will work
2. ✅ You can test with `node test-api.js`
3. ✅ You can start the frontend
4. ✅ You'll see 3 sample boards
5. ✅ You can create, edit, delete boards/lists/cards
6. ✅ Drag and drop will work
7. ✅ All features will be functional

## Need Help?

The backend is already running and waiting for the database to be ready. Just complete the Supabase SQL setup and everything will work!
