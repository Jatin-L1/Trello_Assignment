# Quick Start Guide

Get the Trello Clone running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)

## Step 1: Database Setup (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (wait ~2 minutes for setup)
3. Go to SQL Editor → New Query
4. Copy and paste contents of `backend/database/schema.sql`
5. Click "Run" and wait for success
6. Create another new query
7. Copy and paste contents of `backend/database/seed.sql`
8. Click "Run"
9. Go to Settings → Database → Connection String → URI
10. Copy the connection string

## Step 2: Backend Setup (1 minute)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and paste your Supabase connection string:
```
DATABASE_URL=your_supabase_connection_string_here
```

Start the backend:
```bash
npm run dev
```

You should see: `🚀 Server running on port 5000`

## Step 3: Frontend Setup (1 minute)

Open a new terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

The `.env.local` should already have:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

You should see: `Ready on http://localhost:3000`

## Step 4: Open and Explore! (1 minute)

1. Open browser to `http://localhost:3000`
2. You'll see 3 sample boards
3. Click on "Product Roadmap" board
4. Try these features:
   - ✅ Drag cards between lists
   - ✅ Drag lists to reorder
   - ✅ Click a card to see details
   - ✅ Add a new card
   - ✅ Add a new list
   - ✅ Create a new board

## Troubleshooting

### Backend won't start
- Check if port 5000 is available: `lsof -i :5000`
- Verify DATABASE_URL in `.env` is correct
- Test database connection: `psql "your_connection_string"`

### Frontend won't start
- Check if port 3000 is available: `lsof -i :3000`
- Clear Next.js cache: `rm -rf .next && npm run dev`

### Can't see boards
- Check backend is running on port 5000
- Check browser console for errors (F12)
- Verify NEXT_PUBLIC_API_URL in `.env.local`
- Test backend: `curl http://localhost:5000/health`

### Database errors
- Verify schema.sql ran successfully
- Check Supabase project is active
- Ensure connection string includes password

## What's Next?

### Explore Features
- Create your own board
- Add lists and cards
- Try drag and drop
- Open card details and add:
  - Description
  - Labels
  - Checklists
  - Comments
  - Due dates

### Customize
- Change board backgrounds
- Add more sample data
- Modify colors in `tailwind.config.js`

### Deploy
- Follow `DEPLOYMENT.md` for production deployment
- Deploy to Vercel (frontend) and Render (backend)

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Backend: Changes auto-restart server
- Frontend: Changes auto-refresh browser

### View Logs
- Backend: Check terminal running `npm run dev`
- Frontend: Check browser console (F12)

### Database Changes
After modifying schema:
```bash
psql "your_connection_string" -f backend/database/schema.sql
```

### Reset Everything
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules .next
npm install
```

## Sample Data

The seed data includes:
- 3 boards (Product Roadmap, Marketing Campaign, Personal Tasks)
- 4 users (John, Jane, Bob, Alice)
- Multiple lists per board
- Sample cards with labels, members, checklists
- Comments and activities

## API Endpoints

Test the API:

```bash
# Health check
curl http://localhost:5000/health

# Get all boards
curl http://localhost:5000/api/boards

# Get specific board
curl http://localhost:5000/api/boards/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
```

## Common Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm start            # Start production server

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
```

## File Structure

```
trello-clone/
├── backend/          # Express.js API
│   ├── database/     # SQL files
│   └── src/          # Source code
├── frontend/         # Next.js app
│   └── src/          # Source code
├── README.md         # Project overview
├── QUICKSTART.md     # This file
├── DEVELOPMENT.md    # Detailed dev guide
└── DEPLOYMENT.md     # Production deployment
```

## Need Help?

1. Check `DEVELOPMENT.md` for detailed information
2. Review `DEPLOYMENT.md` for production setup
3. Check browser/server console for errors
4. Verify all environment variables are set

## Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can see boards at localhost:3000
- [ ] Can click and open a board
- [ ] Can drag and drop cards
- [ ] Can create new cards/lists
- [ ] Can open card details modal

---

**Congratulations!** 🎉 You're now running a production-grade Trello clone!

Next steps:
- Explore all features
- Read `DEVELOPMENT.md` for development guide
- Deploy to production using `DEPLOYMENT.md`
