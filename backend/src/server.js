const express = require('express');
const cors = require('cors');
require('dotenv').config();

const boardRoutes = require('./routes/boards');
const listRoutes = require('./routes/lists');
const cardRoutes = require('./routes/cards');
const labelRoutes = require('./routes/labels');
const checklistRoutes = require('./routes/checklists');
const commentRoutes = require('./routes/comments');
const memberRoutes = require('./routes/members');
const activityRoutes = require('./routes/activities');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/activities', activityRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
