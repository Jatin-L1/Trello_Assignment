# 🎯 SUPABASE SQL SETUP - VISUAL GUIDE

## ⚠️ IMPORTANT: Don't run SQL files in PowerShell!

You need to run them in the **Supabase Web Interface**.

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Open Supabase Dashboard

1. Open your web browser
2. Go to: **https://supabase.com/dashboard**
3. Log in to your account
4. Click on your project: **nwqktzqgmssgorrghfmd**

### Step 2: Open SQL Editor

1. Look at the left sidebar
2. Find and click: **"SQL Editor"** (it has a database icon)
3. Click the **"New Query"** button (top right)

### Step 3: Run Schema SQL

1. **In VS Code** (or your code editor):
   - Open file: `backend/database/schema.sql`
   - Press `Ctrl + A` (select all)
   - Press `Ctrl + C` (copy)

2. **In Supabase SQL Editor** (web browser):
   - Click in the query editor area
   - Press `Ctrl + V` (paste)
   - You should see all the SQL code
   - Click the **"Run"** button (or press `Ctrl + Enter`)

3. **Wait for success message**:
   - You should see: "Success. No rows returned"
   - This means 13 tables were created!

### Step 4: Run Seed SQL

1. **In Supabase**, click **"New Query"** again

2. **In VS Code**:
   - Open file: `backend/database/seed.sql`
   - Press `Ctrl + A` (select all)
   - Press `Ctrl + C` (copy)

3. **In Supabase SQL Editor**:
   - Click in the query editor area
   - Press `Ctrl + V` (paste)
   - Click the **"Run"** button

4. **Wait for success message**:
   - You should see: "Success. No rows returned"
   - This means sample data was added!

### Step 5: Verify Tables

1. **In Supabase**, click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - `users` - Click it, you should see 4 users
   - `boards` - Click it, you should see 3 boards
   - `lists` - Click it, you should see multiple lists
   - `cards` - Click it, you should see multiple cards
   - And 9 more tables...

---

## 🎬 VISUAL WALKTHROUGH

```
┌─────────────────────────────────────────────────────────┐
│  Supabase Dashboard                                     │
├─────────────────────────────────────────────────────────┤
│  Left Sidebar:                                          │
│  ┌──────────────┐                                       │
│  │ 🏠 Home      │                                       │
│  │ 📊 Table Ed. │ ← Click here to verify tables        │
│  │ 🔍 SQL Editor│ ← Click here first!                  │
│  │ 🔐 Auth      │                                       │
│  │ 📦 Storage   │                                       │
│  └──────────────┘                                       │
│                                                          │
│  SQL Editor:                                            │
│  ┌────────────────────────────────────────────────────┐│
│  │ [New Query] [Run] [Format]                         ││
│  ├────────────────────────────────────────────────────┤│
│  │                                                     ││
│  │  -- Paste your SQL here                            ││
│  │  CREATE TABLE users (                              ││
│  │    id UUID PRIMARY KEY...                          ││
│  │  );                                                 ││
│  │                                                     ││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST

- [ ] Opened Supabase dashboard in browser
- [ ] Clicked "SQL Editor" in left sidebar
- [ ] Clicked "New Query" button
- [ ] Copied `schema.sql` from VS Code
- [ ] Pasted into Supabase SQL Editor
- [ ] Clicked "Run" button
- [ ] Saw "Success" message
- [ ] Clicked "New Query" again
- [ ] Copied `seed.sql` from VS Code
- [ ] Pasted into Supabase SQL Editor
- [ ] Clicked "Run" button
- [ ] Saw "Success" message
- [ ] Clicked "Table Editor" to verify
- [ ] Saw `users` table with 4 rows
- [ ] Saw `boards` table with 3 rows

---

## 🚨 COMMON MISTAKES

### ❌ WRONG: Running in PowerShell
```powershell
PS D:\Scaler_2\backend\database> seed.sql
# This doesn't work!
```

### ✅ CORRECT: Running in Supabase Web Interface
1. Open browser → Supabase.com
2. Go to SQL Editor
3. Paste SQL code
4. Click Run

---

## 🎯 AFTER SETUP

Once you complete the SQL setup, come back to PowerShell and run:

```powershell
# Test the API
node test-api.js

# Start the frontend
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

---

## 📞 NEED HELP?

If you see errors in Supabase:
1. Read the error message carefully
2. Make sure you copied the ENTIRE file
3. Try running it again
4. Check if you're in the correct project

---

## 🔗 QUICK LINKS

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Your Project**: https://supabase.com/dashboard/project/nwqktzqgmssgorrghfmd
- **SQL Editor**: https://supabase.com/dashboard/project/nwqktzqgmssgorrghfmd/sql

---

**Remember: SQL files run in Supabase web interface, NOT in PowerShell!** 🎯
