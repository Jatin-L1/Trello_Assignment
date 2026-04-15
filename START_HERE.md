# ⚡ START HERE - Quick Setup (5 Minutes)

## 🎯 What You Need

Your Supabase connection string with **port 5432** (direct connection).

---

## 📝 Step 1: Get Connection String (2 min)

1. Go to: https://supabase.com/dashboard/project/nwqktzqgmssgorrghfmd/settings/database
2. Find "Connection string" → "URI" tab
3. Copy the string and replace `[YOUR-PASSWORD]` with: **OAET22cN**

It should look like:
```
postgresql://postgres.nwqktzqgmssgorrghfmd:OAET22cN@db.nwqktzqgmssgorrghfmd.supabase.co:5432/postgres
```

---

## 📝 Step 2: Update .env (30 seconds)

Open `backend/.env` and paste:

```env
PORT=5000
DATABASE_URL=postgresql://postgres.nwqktzqgmssgorrghfmd:OAET22cN@db.nwqktzqgmssgorrghfmd.supabase.co:5432/postgres
NODE_ENV=development
```

**Important:** Use port **5432**, not 6543!

---

## 📝 Step 3: Run Commands (2 min)

```bash
cd backend

# Create database tables
npx prisma migrate dev --name init

# Add sample data
npm run prisma:seed

# Start backend
npm run dev
```

---

## 📝 Step 4: Test & Run (1 min)

**New terminal:**
```bash
# Test API
node test-api.js

# Start frontend
cd frontend
npm run dev
```

**Open browser:** http://localhost:3000

---

## ✅ Success!

You should see:
- ✅ 3 boards on home page
- ✅ Click a board to see lists and cards
- ✅ Drag cards between lists
- ✅ All features working!

---

## 🚨 If Something Fails

### "Tenant or user not found"
→ Make sure you're using port **5432** in DATABASE_URL

### "Can't reach database"
→ Check password is **OAET22cN**

### Still stuck?
→ Read `COMPLETE_SETUP_GUIDE.md` for detailed help

---

## 🎉 That's It!

**3 commands and you're done:**
1. `npx prisma migrate dev --name init`
2. `npm run prisma:seed`
3. `npm run dev`

**No manual SQL. No copy-pasting. Just works!** ✨
