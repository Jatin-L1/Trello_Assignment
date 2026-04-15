const prisma = require('../config/database');

// Create label
exports.createLabel = async (req, res, next) => {
  try {
    const { board_id, name, color } = req.body;

    const label = await prisma.label.create({
      data: {
        boardId: board_id,
        name: name || '',
        color,
      },
    });

    res.status(201).json({ success: true, data: label });
  } catch (error) {
    next(error);
  }
};

// Update label
exports.updateLabel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const label = await prisma.label.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(color && { color }),
      },
    });

    res.json({ success: true, data: label });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Label not found' });
    }
    next(error);
  }
};

// Delete label
exports.deleteLabel = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.label.delete({ where: { id } });

    res.json({ success: true, message: 'Label deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Label not found' });
    }
    next(error);
  }
};

// Add label to card
exports.addLabelToCard = async (req, res, next) => {
  try {
    const { card_id, label_id } = req.body;

    const cardLabel = await prisma.cardLabel.create({
      data: {
        cardId: card_id,
        labelId: label_id,
      },
    });

    res.status(201).json({ success: true, data: cardLabel });
  } catch (error) {
    // Ignore duplicate errors
    if (error.code === 'P2002') {
      return res.json({ success: true, message: 'Label already added' });
    }
    next(error);
  }
};

// Remove label from card
exports.removeLabelFromCard = async (req, res, next) => {
  try {
    const { card_id, label_id } = req.params;

    await prisma.cardLabel.deleteMany({
      where: {
        cardId: card_id,
        labelId: label_id,
      },
    });

    res.json({ success: true, message: 'Label removed from card' });
  } catch (error) {
    next(error);
  }
};
