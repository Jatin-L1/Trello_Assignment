# 📋 Trello Clone - Project Management Tool

> **SDE Intern Fullstack Assignment**

A full-stack Kanban-style project management web application that closely replicates Trello's design and user experience. 

🔗 **Live Demo:** [Frontend on Vercel](https://trello-04.vercel.app/)
🔗 **API Endpoint:** [Backend API on Render](https://trello-assignment-vwgh.onrender.com/)

---

## ✨ Features Implemented

### 📌 Core Features (100% Completed)
- **Board Management:** Create, view, and manage multiple boards.
- **Lists Management:** Create, edit, delete, and drag-and-drop to reorder lists smoothly.
- **Cards Management:** Create, edit (title/description), delete/archive, and flawlessly drag-and-drop cards between or within lists.
- **Card Details (Modal):**
  - 🏷️ **Labels:** Add/remove colored tags.
  - 📅 **Due Dates:** Set deadlines with visual "Overdue" or "Due Soon" badge indicators.
  - ✅ **Checklists:** Create nested tasks and track progress dynamically with completion bars.
  - 👥 **Members:** Assign users to specific tasks.
- **Search & Filter:** Global search by card title, and robust filtering by labels, assigned members, or due dates.

### 🌟 Bonus / Good-to-Have Features
- **Responsive Design:** Adapts smoothly across mobile, tablet, and desktop views.
- **Multiple Boards Support:** Seamlessly navigate between different projects.
- **File Attachments & Comments:** Upload files (via Cloudinary) and leave comments on cards.
- **Card Covers & Customization:** Attach URLs or solid background colors to highlight cards.
- **Board & List Background Customization:** Customize the workspace vibe globally and at the list-column level.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, Zustand (State Management), `@dnd-kit` (Drag & Drop).
- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL (via Supabase), Prisma ORM.
- **Media Storage:** Cloudinary & Multer (for image/attachment uploads).

---

## 🛠️ Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL / Supabase connection string

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL=your_database_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run migrations and start the server:
```bash
npx prisma db push
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser to use the app.

---

## 🗄️ Database Design
The application utilizes a relational database structure designed with Prisma ORM:
- **Board:** Has many Lists and Members.
- **List:** Has many Cards. Reordered via positional indexing.
- **Card:** The central entity. Has many Comments, Attachments, Checklists, and Many-to-Many relations with Labels and Members. 
- **Checklists & Items:** Nested relationships for granular task tracking.

---

## 💡 Assumptions Made (Assignment Rubric)

- **Authentication:** As per the assignment instructions, no formal login/authentication system was implemented. The application operates under an assumed default user state to allow seamless testing of features.
- **Sample Data / Members:** Sample members and data have been seeded directly into the database to support the assignment/filtering functionality.
- **Media Storage:** Cloudinary is used to securely store and deliver card image attachments and covers rather than saving files locally. 
- **Optimistic UI:** The frontend leverages Zustand to optimistically update the UI constraints during drag-and-drop interactions before the backend responds, ensuring a buttery-smooth Trello-like experience.
