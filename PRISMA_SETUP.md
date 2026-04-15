# 🚀 Prisma ORM Setup Guide

## What is Prisma?

Prisma is a modern ORM (Object-Relational Mapping) that makes database management easy:
- ✅ **No manual SQL** - Write JavaScript/TypeScript instead
- ✅ **Automatic migrations** - Database schema updates automatically
- ✅ **Type-safe** - Catch errors before runtime
- ✅ **Easy seeding** - Populate database with one command

---

## 📋 Setup Steps (5 Minutes)

### Step 1: Install Prisma Dependencies

```bash
cd backend
npm install
```

This installs:
- `@prisma/client` - Database client
- `prisma` - CLI tool for migrations

### Step 2: Generate Prisma Client

```bash
npm run prisma:generate
```

This creates the Prisma Client based on your schema.

### Step 3: Run Database Migration

```bash
npm run prisma:migrate
```

**What this does:**
- Creates all 13 tables in Supabase
- Sets up relationships and indexes
- Applies constraints
- **No need to copy/paste SQL!**

When prompted for migration name, type: `init`

### Step 4: Seed the Database

```bash
npm run prisma:seed
```

**What this does:**
- Creates 4 sample users
- Creates 3 boards
- Adds lists, cards, labels
- Adds checklists and comments
- **All with one command!**

### Step 5: Start the Backend

```bash
npm run dev
```

Backend will start on port 5000.

### Step 6: Test API

Open a new terminal:

```bash
node test-api.js
```

You should see all ✅ green checkmarks!

### Step 7: Start Frontend

```bash
cd frontend
npm run dev
```

Open: **http://localhost:3000**

---

## 🎯 Quick Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Deploy migrations to production
npm run prisma:deploy
```

---

## 🔍 Prisma Studio (Database GUI)

Want to see your database visually?

```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Edit data
- Add/delete records
- No SQL needed!

---

## 📊 What Gets Created

### Tables (13):
1. **users** - 4 sample users
2. **boards** - 3 sample boards
3. **board_members** - Board access control
4. **lists** - Multiple lists per board
5. **cards** - Cards with full details
6. **labels** - Colored labels
7. **card_labels** - Card-label relationships
8. **card_members** - Card assignments
9. **checklists** - Task checklists
10. **checklist_items** - Individual checklist items
11. **comments** - Card comments
12. **attachments** - File attachments
13. **activities** - Activity log

### Sample Data:
- **Users**: John Doe, Jane Smith, Bob Wilson, Alice Brown
- **Boards**: Product Roadmap, Marketing Campaign, Personal Tasks
- **Cards**: ~10 cards with labels, members, checklists
- **Comments**: Sample comments on cards

---

## 🔧 Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"

**Solution:** Make sure `backend/.env` exists with:
```
DATABASE_URL=postgresql://postgres.nwqktzqgmssgorrghfmd:OAET22cN@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Error: "Can't reach database server"

**Solution:** 
- Check your Supabase project is active
- Verify the DATABASE_URL is correct
- Make sure you're using the pooler connection (port 6543)

### Migration fails

**Solution:**
```bash
# Reset database and try again
npx prisma migrate reset
npm run prisma:migrate
npm run prisma:seed
```

### Seed fails

**Solution:**
- Make sure migration ran successfully first
- Check for UUID conflicts
- Try running seed again

---

## 🆚 Prisma vs Manual SQL

### Before (Manual SQL):
1. ❌ Copy schema.sql to Supabase
2. ❌ Paste and run in SQL Editor
3. ❌ Copy seed.sql to Supabase
4. ❌ Paste and run in SQL Editor
5. ❌ Hope nothing breaks

### After (Prisma):
1. ✅ `npm run prisma:migrate` (creates tables)
2. ✅ `npm run prisma:seed` (adds data)
3. ✅ Done!

---

## 📝 Making Schema Changes

Need to add a new field or table?

1. Edit `backend/prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Prisma automatically updates your database!

Example - Add a field:
```prisma
model Card {
  // ... existing fields
  priority String? // Add this
}
```

Then run:
```bash
npm run prisma:migrate
```

Prisma will:
- Detect the change
- Create a migration
- Apply it to your database
- Update the Prisma Client

---

## 🎓 Prisma Benefits

### Type Safety
```javascript
// ✅ TypeScript knows all fields
const board = await prisma.board.findUnique({
  where: { id: boardId }
});
// board.title ✅ (autocomplete works!)
// board.invalidField ❌ (TypeScript error)
```

### Easy Queries
```javascript
// Get board with all related data
const board = await prisma.board.findUnique({
  where: { id },
  include: {
    lists: {
      include: {
        cards: true
      }
    }
  }
});
```

### Automatic Migrations
- No manual SQL scripts
- Version controlled
- Rollback support
- Team collaboration

---

## 🚀 Production Deployment

When deploying to production:

```bash
# In your deployment script
npm run prisma:generate
npm run prisma:deploy
npm start
```

Prisma will:
- Generate the client
- Apply pending migrations
- Start your app

---

## 📚 Learn More

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

## ✅ Success Checklist

- [ ] Installed dependencies (`npm install`)
- [ ] Generated Prisma Client (`npm run prisma:generate`)
- [ ] Ran migration (`npm run prisma:migrate`)
- [ ] Seeded database (`npm run prisma:seed`)
- [ ] Started backend (`npm run dev`)
- [ ] Tested API (`node test-api.js`)
- [ ] Started frontend (`cd frontend && npm run dev`)
- [ ] Opened browser (`http://localhost:3000`)

---

**With Prisma, database management is now as easy as running a few commands!** 🎉
