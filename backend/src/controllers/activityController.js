const prisma = require('../config/database');

// Get activities for a board
exports.getBoardActivities = async (req, res, next) => {
  try {
    const { board_id } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const activities = await prisma.activity.findMany({
      where: { boardId: board_id },
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
};

// Create activity
exports.createActivity = async (req, res, next) => {
  try {
    const { board_id, card_id, user_id, action, entity_type, entity_id, details } = req.body;

    const activity = await prisma.activity.create({
      data: {
        boardId: board_id,
        cardId: card_id,
        userId: user_id,
        action,
        entityType: entity_type,
        entityId: entity_id,
        details: details || null,
      },
    });

    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};
