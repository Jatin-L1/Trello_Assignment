# Development Guide

Complete guide for setting up and developing the Trello Clone locally.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or Supabase account)
- Git
- Code editor (VS Code recommended)

## Initial Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd trello-clone
```

### 2. Database Setup

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb trello_clone

# Run migrations
psql -d trello_clone -f backend/database/schema.sql
psql -d trello_clone -f backend/database/seed.sql
```

#### Option B: Supabase (Recommended)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run SQL from `backend/database/schema.sql` in SQL Editor
4. Run SQL from `backend/database/seed.sql`
5. Copy connection string from Settings → Database

### 3. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL=postgresql://user:password@localhost:5432/trello_clone
# or your Supabase connection string

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

Test: `curl http://localhost:5000/health`

### 4. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Project Structure

```
trello-clone/
├── backend/
│   ├── database/
│   │   ├── schema.sql          # Database schema
│   │   └── seed.sql            # Sample data
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # Database connection
│   │   ├── controllers/        # Business logic
│   │   │   ├── boardController.js
│   │   │   ├── listController.js
│   │   │   ├── cardController.js
│   │   │   ├── labelController.js
│   │   │   ├── checklistController.js
│   │   │   ├── commentController.js
│   │   │   ├── memberController.js
│   │   │   └── activityController.js
│   │   ├── routes/             # API routes
│   │   │   ├── boards.js
│   │   │   ├── lists.js
│   │   │   ├── cards.js
│   │   │   ├── labels.js
│   │   │   ├── checklists.js
│   │   │   ├── comments.js
│   │   │   ├── members.js
│   │   │   └── activities.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── server.js           # Express app
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Home page (boards list)
│   │   │   ├── globals.css     # Global styles
│   │   │   └── board/
│   │   │       └── [id]/
│   │   │           └── page.tsx # Board page
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Board.tsx       # Main board with DnD
│   │   │   ├── BoardHeader.tsx
│   │   │   ├── BoardCard.tsx
│   │   │   ├── List.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── CardModal.tsx   # Card details modal
│   │   │   ├── CreateBoardModal.tsx
│   │   │   └── CreateListButton.tsx
│   │   ├── services/
│   │   │   └── api.ts          # API client
│   │   ├── store/
│   │   │   └── boardStore.ts   # Zustand store
│   │   └── lib/
│   │       └── utils.ts        # Utility functions
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── next.config.js
│
├── README.md
├── DEPLOYMENT.md
└── DEVELOPMENT.md
```

## Development Workflow

### Making Changes

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Backend: Edit controllers/routes in `backend/src/`
   - Frontend: Edit components in `frontend/src/`

3. **Test locally**
   - Backend: Test API endpoints with curl/Postman
   - Frontend: Test in browser at `localhost:3000`

4. **Commit changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

5. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

### Database Changes

When modifying the database schema:

1. Update `backend/database/schema.sql`
2. Create migration script if needed
3. Test locally:
```bash
psql -d trello_clone -f backend/database/schema.sql
```
4. Update seed data if necessary

### API Development

#### Adding New Endpoint

1. **Create controller function** (`backend/src/controllers/`)
```javascript
exports.newFunction = async (req, res, next) => {
  try {
    // Your logic here
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

2. **Add route** (`backend/src/routes/`)
```javascript
router.post('/new-endpoint', controller.newFunction);
```

3. **Update API service** (`frontend/src/services/api.ts`)
```typescript
async newEndpoint(data: any) {
  return this.request('/api/new-endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

### Frontend Development

#### Creating New Component

1. Create file in `frontend/src/components/`
2. Use TypeScript and proper typing
3. Follow existing component patterns
4. Use Tailwind CSS for styling

Example:
```typescript
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2>{title}</h2>
      <button onClick={onAction} className="btn btn-primary">
        Action
      </button>
    </div>
  );
}
```

#### State Management

Use Zustand store for global state:

```typescript
// In boardStore.ts
newAction: async (data: any) => {
  try {
    const response = await api.newEndpoint(data);
    set((state) => ({
      // Update state
    }));
  } catch (error: any) {
    set({ error: error.message });
  }
}
```

## Testing

### Backend Testing

Test API endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Get boards
curl http://localhost:5000/api/boards

# Create board
curl -X POST http://localhost:5000/api/boards \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Board","background_color":"#0079bf"}'

# Get board details
curl http://localhost:5000/api/boards/{board_id}
```

### Frontend Testing

1. Manual testing in browser
2. Test all user flows:
   - Create board
   - Add lists
   - Add cards
   - Drag and drop
   - Edit card details
   - Add labels, checklists, comments

## Common Tasks

### Reset Database

```bash
# Drop and recreate
dropdb trello_clone
createdb trello_clone
psql -d trello_clone -f backend/database/schema.sql
psql -d trello_clone -f backend/database/seed.sql
```

### Clear Frontend Cache

```bash
cd frontend
rm -rf .next
npm run dev
```

### Update Dependencies

```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

## Debugging

### Backend Debugging

1. **Check logs**: Console output shows all requests
2. **Database queries**: Add `console.log()` in controllers
3. **Use debugger**:
```javascript
// Add breakpoint
debugger;
```

Run with:
```bash
node --inspect src/server.js
```

### Frontend Debugging

1. **Browser DevTools**: F12 or Cmd+Option+I
2. **React DevTools**: Install browser extension
3. **Network tab**: Check API requests/responses
4. **Console**: Check for errors

### Common Issues

**Port already in use:**
```bash
# Find process
lsof -i :5000  # or :3000
# Kill process
kill -9 <PID>
```

**Database connection error:**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

**CORS errors:**
- Verify backend CORS configuration
- Check NEXT_PUBLIC_API_URL in frontend

## Code Style

### Backend (JavaScript)

- Use async/await for async operations
- Use try/catch for error handling
- Use meaningful variable names
- Add comments for complex logic

### Frontend (TypeScript)

- Use TypeScript types/interfaces
- Use functional components with hooks
- Use Tailwind CSS classes
- Keep components small and focused

### Git Commits

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

## Performance Tips

### Backend

- Use database indexes
- Implement pagination for large datasets
- Cache frequently accessed data
- Use connection pooling

### Frontend

- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Optimize images
- Code splitting with dynamic imports

## Security Best Practices

- Never commit .env files
- Validate all user inputs
- Use parameterized queries (prevent SQL injection)
- Implement rate limiting
- Keep dependencies updated
- Use HTTPS in production

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [dnd-kit Documentation](https://docs.dndkit.com/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

## Getting Help

1. Check this documentation
2. Review existing code for patterns
3. Check browser/server console for errors
4. Search for similar issues online
5. Ask team members

---

Happy coding! 🚀
