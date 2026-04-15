const prisma = require('../config/database');

// Create comment
exports.createComment = async (req, res, next) => {
  try {
    const { card_id, user_id, content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        cardId: card_id,
        userId: user_id || '11111111-1111-1111-1111-111111111111',
        content,
      },
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

// Update comment
exports.updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.json({ success: true, data: comment });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    next(error);
  }
};

// Delete comment
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.comment.delete({ where: { id } });

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    next(error);
  }
};
