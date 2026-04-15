# Trello Clone - Full-Stack Kanban Project Management Tool

A production-grade Trello clone built with modern technologies, featuring drag-and-drop functionality, real-time updates, and a pixel-perfect UI.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **Tailwind CSS** (Styling)
- **@dnd-kit** (Drag & Drop)
- **Zustand** (State Management)
- **React Hook Form** (Form Handling)

### Backend
- **Node.js + Express.js**
- **PostgreSQL** (via Supabase)
- **CORS** enabled

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Supabase

## ✨ Features

### Core Features
- ✅ Create and manage multiple boards
- ✅ Create, edit, delete lists
- ✅ Create, edit, delete cards
- ✅ Drag & drop cards between lists
- ✅ Reorder cards within lists
- ✅ Reorder lists on board
- ✅ Card details modal with:
  - Labels (colored tags)
  - Due dates
  - Checklists with toggle items
  - Member assignments
  - Description editing
- ✅ Search cards by title
- ✅ Filter by labels, members, due date

### Bonus Features
- ✅ Multiple boards support
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Board background customization
- ✅ Card cover images
- ✅ Activity log
- ✅ Comments system
- ✅ File attachments

## 📁 Project Structure

```
trello-clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── server.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── lib/
│   └── package.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL (or Supabase account)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
DATABASE_URL=your_supabase_connection_string
```

4. Run database migrations:
```bash
psql -h your_host -U your_user -d your_db -f database/schema.sql
psql -h your_host -U your_user -d your_db -f database/seed.sql
```

5. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy Backend to Render

1. Create new Web Service on Render
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

### Deploy Frontend to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend: `cd frontend`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard

### Setup Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL from `database/schema.sql` in SQL Editor
3. Run SQL from `database/seed.sql` for sample data
4. Copy connection string to backend `.env`

## 🎨 UI/UX Highlights

- Pixel-perfect Trello UI replication
- Smooth drag-and-drop animations
- Hover effects and transitions
- Responsive design for all devices
- Loading states and error handling
- Optimistic UI updates

## 📝 API Endpoints

### Boards
- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create board
- `GET /api/boards/:id` - Get board details
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Lists
- `POST /api/lists` - Create list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list
- `PUT /api/lists/:id/position` - Update list position

### Cards
- `POST /api/cards` - Create card
- `GET /api/cards/:id` - Get card details
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card
- `PUT /api/cards/:id/position` - Update card position

### Labels, Members, Checklists
- Full CRUD operations for all entities
- See API documentation for complete list

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

## 📄 License

MIT

## 👨‍💻 Author

Built as a demonstration of full-stack engineering capabilities.

---

**Note**: This is a portfolio project demonstrating production-grade development practices.
