const prisma = require('../config/database');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { fullName: 'asc' },
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// Add member to card
exports.addMemberToCard = async (req, res, next) => {
  try {
    const { card_id, user_id } = req.body;

    const cardMember = await prisma.cardMember.create({
      data: {
        cardId: card_id,
        userId: user_id,
      },
    });

    res.status(201).json({ success: true, data: cardMember });
  } catch (error) {
    // Ignore duplicate errors
    if (error.code === 'P2002') {
      return res.json({ success: true, message: 'Member already added' });
    }
    next(error);
  }
};

// Remove member from card
exports.removeMemberFromCard = async (req, res, next) => {
  try {
    const { card_id, user_id } = req.params;

    await prisma.cardMember.deleteMany({
      where: {
        cardId: card_id,
        userId: user_id,
      },
    });

    res.json({ success: true, message: 'Member removed from card' });
  } catch (error) {
    next(error);
  }
};
