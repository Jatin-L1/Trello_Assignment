# Architecture Documentation

Comprehensive technical architecture of the Trello Clone application.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js 14 (React 18)                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │   Pages  │  │Components│  │  State Management    │ │ │
│  │  │  (App    │  │  (UI)    │  │     (Zustand)        │ │ │
│  │  │  Router) │  │          │  │                      │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         API Service Layer (Fetch)                │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              │
┌─────────────────────────────────────────────────────────────┐
│                         Server Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 Express.js API                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │  Routes  │→ │Controllers│→ │    Database Pool     │ │ │
│  │  │  (REST)  │  │ (Logic)  │  │    (pg)              │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         Middleware (CORS, Error Handler)         │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ PostgreSQL Protocol
                              │
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL (Supabase)                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │  Tables  │  │  Indexes │  │    Constraints       │ │ │
│  │  │  (13)    │  │  (20+)   │  │    (FK, Unique)      │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Date Handling**: date-fns
- **Icons**: lucide-react

### Directory Structure

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (boards list)
│   ├── globals.css        # Global styles
│   └── board/
│       └── [id]/
│           └── page.tsx   # Dynamic board page
│
├── components/            # React components
│   ├── Navbar.tsx        # Top navigation
│   ├── Board.tsx         # Main board with DnD context
│   ├── BoardHeader.tsx   # Board title and actions
│   ├── BoardCard.tsx     # Board preview card
│   ├── List.tsx          # List component (sortable)
│   ├── Card.tsx          # Card component (sortable)
│   ├── CardModal.tsx     # Card details modal
│   ├── CreateBoardModal.tsx
│   └── CreateListButton.tsx
│
├── services/             # API integration
│   └── api.ts           # Centralized API client
│
├── store/               # State management
│   └── boardStore.ts    # Zustand store
│
├── hooks/               # Custom React hooks
│   └── useDebounce.ts   # Debounce hook
│
└── lib/                 # Utilities
    └── utils.ts         # Helper functions
```

### Component Hierarchy

```
App
└── Layout
    ├── Navbar
    └── Page (Home)
        ├── BoardCard (multiple)
        └── CreateBoardModal

App
└── Layout
    ├── Navbar
    └── Page (Board)
        ├── BoardHeader
        └── Board (DnD Context)
            ├── List (multiple, sortable)
            │   ├── Card (multiple, sortable)
            │   │   └── CardModal (conditional)
            │   └── CreateCardButton
            └── CreateListButton
```

### State Management (Zustand)

```typescript
BoardStore {
  // State
  boards: Board[]
  currentBoard: Board | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchBoards()
  fetchBoard(id)
  createBoard(data)
  updateBoard(id, data)
  deleteBoard(id)
  
  // List actions
  createList(boardId, title)
  updateList(id, title)
  deleteList(id)
  moveList(id, position)
  
  // Card actions
  createCard(listId, title)
  updateCard(id, data)
  deleteCard(id)
  moveCard(id, listId, position)
  
  // Optimistic updates
  optimisticMoveCard(...)
  optimisticMoveList(...)
}
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Action
    ↓
Optimistic Update (immediate UI change)
    ↓
API Service Call
    ↓
Backend API
    ↓
Database Update
    ↓
Response
    ↓
Zustand State Update (confirm or rollback)
    ↓
Component Re-render
```

### Drag & Drop Architecture

```
DndContext (Board level)
├── Sensors
│   ├── PointerSensor (mouse/touch)
│   └── KeyboardSensor (accessibility)
├── Collision Detection
│   └── closestCorners algorithm
├── Event Handlers
│   ├── onDragStart → Set active item
│   ├── onDragOver → Calculate new position
│   └── onDragEnd → Persist to database
└── DragOverlay
    └── Visual feedback during drag

SortableContext (Lists - horizontal)
└── List (multiple, sortable)
    └── SortableContext (Cards - vertical)
        └── Card (multiple, sortable)
```

## Backend Architecture

### Technology Stack

- **Framework**: Express.js
- **Language**: JavaScript (Node.js)
- **Database Client**: pg (node-postgres)
- **Middleware**: CORS, body-parser

### Directory Structure

```
backend/src/
├── config/
│   └── database.js        # PostgreSQL connection pool
│
├── controllers/           # Business logic
│   ├── boardController.js
│   ├── listController.js
│   ├── cardController.js
│   ├── labelController.js
│   ├── checklistController.js
│   ├── commentController.js
│   ├── memberController.js
│   └── activityController.js
│
├── routes/               # API endpoints
│   ├── boards.js
│   ├── lists.js
│   ├── cards.js
│   ├── labels.js
│   ├── checklists.js
│   ├── comments.js
│   ├── members.js
│   └── activities.js
│
├── middleware/
│   └── errorHandler.js   # Centralized error handling
│
└── server.js            # Express app setup
```

### API Architecture

```
Request
    ↓
Express Middleware (CORS, JSON parser)
    ↓
Route Handler
    ↓
Controller Function
    ↓
Database Query (parameterized)
    ↓
Result Processing
    ↓
Response (JSON)
    ↓
Error Handler (if error)
```

### RESTful API Design

```
Boards
GET    /api/boards              # List all boards
POST   /api/boards              # Create board
GET    /api/boards/:id          # Get board with lists/cards
PUT    /api/boards/:id          # Update board
DELETE /api/boards/:id          # Delete board

Lists
POST   /api/lists               # Create list
PUT    /api/lists/:id           # Update list
PUT    /api/lists/:id/position  # Update list position
DELETE /api/lists/:id           # Delete list

Cards
GET    /api/cards/search        # Search cards
GET    /api/cards/:id           # Get card details
POST   /api/cards               # Create card
PUT    /api/cards/:id           # Update card
PUT    /api/cards/:id/position  # Update card position
DELETE /api/cards/:id           # Delete card

Labels
POST   /api/labels              # Create label
PUT    /api/labels/:id          # Update label
DELETE /api/labels/:id          # Delete label
POST   /api/labels/card         # Add label to card
DELETE /api/labels/:card_id/:label_id  # Remove label

Checklists
POST   /api/checklists          # Create checklist
PUT    /api/checklists/:id      # Update checklist
DELETE /api/checklists/:id      # Delete checklist
POST   /api/checklists/items    # Create item
PUT    /api/checklists/items/:id    # Update item
DELETE /api/checklists/items/:id    # Delete item

Comments
POST   /api/comments            # Create comment
PUT    /api/comments/:id        # Update comment
DELETE /api/comments/:id        # Delete comment

Members
GET    /api/members/users       # Get all users
POST   /api/members/card        # Add member to card
DELETE /api/members/card/:card_id/:user_id  # Remove member

Activities
GET    /api/activities/board/:board_id  # Get board activities
POST   /api/activities          # Create activity
```

### Database Connection Pool

```javascript
Pool Configuration {
  connectionString: process.env.DATABASE_URL
  ssl: { rejectUnauthorized: false }
  max: 20                    // Maximum connections
  idleTimeoutMillis: 30000   // Close idle connections
  connectionTimeoutMillis: 2000
}
```

## Database Architecture

### Schema Design

```
users (4 sample users)
  ├── id (UUID, PK)
  ├── username (unique)
  ├── email (unique)
  ├── full_name
  ├── avatar_url
  └── timestamps

boards
  ├── id (UUID, PK)
  ├── title
  ├── description
  ├── background_color
  ├── background_image
  ├── is_starred
  ├── created_by (FK → users)
  └── timestamps

board_members (many-to-many)
  ├── id (UUID, PK)
  ├── board_id (FK → boards)
  ├── user_id (FK → users)
  ├── role
  └── joined_at

lists
  ├── id (UUID, PK)
  ├── board_id (FK → boards, CASCADE)
  ├── title
  ├── position (integer)
  └── timestamps

cards
  ├── id (UUID, PK)
  ├── list_id (FK → lists, CASCADE)
  ├── title
  ├── description
  ├── position (integer)
  ├── due_date
  ├── cover_image
  ├── is_archived
  ├── created_by (FK → users)
  └── timestamps

labels
  ├── id (UUID, PK)
  ├── board_id (FK → boards, CASCADE)
  ├── name
  ├── color
  └── created_at

card_labels (many-to-many)
  ├── id (UUID, PK)
  ├── card_id (FK → cards, CASCADE)
  ├── label_id (FK → labels, CASCADE)
  └── created_at

card_members (many-to-many)
  ├── id (UUID, PK)
  ├── card_id (FK → cards, CASCADE)
  ├── user_id (FK → users, CASCADE)
  └── assigned_at

checklists
  ├── id (UUID, PK)
  ├── card_id (FK → cards, CASCADE)
  ├── title
  ├── position
  └── created_at

checklist_items
  ├── id (UUID, PK)
  ├── checklist_id (FK → checklists, CASCADE)
  ├── title
  ├── is_completed
  ├── position
  └── timestamps

comments
  ├── id (UUID, PK)
  ├── card_id (FK → cards, CASCADE)
  ├── user_id (FK → users, CASCADE)
  ├── content
  └── timestamps

attachments
  ├── id (UUID, PK)
  ├── card_id (FK → cards, CASCADE)
  ├── filename
  ├── file_url
  ├── file_size
  ├── mime_type
  ├── uploaded_by (FK → users)
  └── created_at

activities
  ├── id (UUID, PK)
  ├── board_id (FK → boards, CASCADE)
  ├── card_id (FK → cards, CASCADE)
  ├── user_id (FK → users)
  ├── action
  ├── entity_type
  ├── entity_id
  ├── details (JSONB)
  └── created_at
```

### Indexes

```sql
-- Foreign key indexes
idx_boards_created_by
idx_lists_board_id
idx_cards_list_id
idx_labels_board_id
idx_card_labels_card_id
idx_card_members_card_id
idx_checklists_card_id
idx_checklist_items_checklist_id
idx_comments_card_id
idx_attachments_card_id
idx_activities_board_id
idx_activities_card_id

-- Position indexes (for ordering)
idx_lists_position (board_id, position)
idx_cards_position (list_id, position)

-- Filter indexes
idx_cards_archived
idx_activities_created_at
```

### Relationships

```
One-to-Many:
- boards → lists
- lists → cards
- cards → checklists
- checklists → checklist_items
- cards → comments
- cards → attachments
- boards → activities

Many-to-Many:
- boards ↔ users (board_members)
- cards ↔ labels (card_labels)
- cards ↔ users (card_members)

Cascading Deletes:
- Delete board → Delete lists → Delete cards → Delete all related
- Delete list → Delete cards → Delete all related
- Delete card → Delete labels, members, checklists, comments, attachments
```

## Security Architecture

### SQL Injection Prevention

```javascript
// ✅ GOOD: Parameterized queries
pool.query('SELECT * FROM cards WHERE id = $1', [cardId])

// ❌ BAD: String concatenation (never used)
pool.query(`SELECT * FROM cards WHERE id = '${cardId}'`)
```

### CORS Configuration

```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
```

### Environment Variables

```
Backend:
- DATABASE_URL (sensitive)
- PORT
- NODE_ENV

Frontend:
- NEXT_PUBLIC_API_URL (public)
```

## Performance Optimizations

### Frontend

1. **Optimistic Updates**: Immediate UI response
2. **Debounced Search**: Reduce API calls
3. **Code Splitting**: Lazy load components
4. **Memoization**: React.memo for expensive components
5. **Image Optimization**: Next.js Image component

### Backend

1. **Connection Pooling**: Reuse database connections
2. **Indexed Queries**: Fast data retrieval
3. **Batch Operations**: Reduce round trips
4. **Efficient Joins**: Minimize queries
5. **Caching Ready**: Structure supports Redis

### Database

1. **Indexes**: 20+ indexes for performance
2. **Foreign Keys**: Maintain referential integrity
3. **Cascading Deletes**: Automatic cleanup
4. **Triggers**: Automatic timestamp updates
5. **JSONB**: Flexible data storage

## Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    ├── Frontend Instance 1 (Vercel Edge)
    ├── Frontend Instance 2 (Vercel Edge)
    └── Frontend Instance N (Vercel Edge)

Load Balancer
    ├── Backend Instance 1 (Render)
    ├── Backend Instance 2 (Render)
    └── Backend Instance N (Render)

Database (Supabase)
    ├── Primary (Write)
    └── Replicas (Read)
```

### Caching Strategy (Future)

```
Client
    ↓
CDN (Static Assets)
    ↓
Redis Cache (API Responses)
    ↓
Backend API
    ↓
Database
```

### Database Scaling

1. **Read Replicas**: Distribute read load
2. **Connection Pooling**: Efficient connection use
3. **Partitioning**: Split large tables
4. **Archiving**: Move old data
5. **Indexing**: Optimize queries

## Deployment Architecture

```
Developer
    ↓
Git Push
    ↓
GitHub Repository
    ├─→ Vercel (Frontend)
    │   ├── Build Next.js
    │   ├── Deploy to Edge
    │   └── CDN Distribution
    │
    └─→ Render (Backend)
        ├── Build Node.js
        ├── Deploy Container
        └── Health Checks

Database: Supabase
    ├── Automatic Backups
    ├── Connection Pooling
    └── Monitoring
```

## Monitoring & Logging

### Frontend (Vercel)

- Deployment logs
- Function logs
- Analytics
- Error tracking (ready for Sentry)

### Backend (Render)

- Application logs
- Request logs
- Error logs
- Performance metrics

### Database (Supabase)

- Query performance
- Connection stats
- Storage usage
- Backup status

---

This architecture is designed for:
- **Scalability**: Can handle growth
- **Maintainability**: Clean, organized code
- **Performance**: Optimized at every layer
- **Security**: Best practices implemented
- **Reliability**: Error handling and recovery
