const prisma = require('../config/database');

// Create checklist
exports.createChecklist = async (req, res, next) => {
  try {
    const { card_id, title } = req.body;

    const maxPosition = await prisma.checklist.aggregate({
      where: { cardId: card_id },
      _max: { position: true },
    });
    const position = (maxPosition._max.position ?? -1) + 1;

    const checklist = await prisma.checklist.create({
      data: {
        cardId: card_id,
        title,
        position,
      },
    });

    res.status(201).json({ success: true, data: checklist });
  } catch (error) {
    next(error);
  }
};

// Update checklist
exports.updateChecklist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const checklist = await prisma.checklist.update({
      where: { id },
      data: { title },
    });

    res.json({ success: true, data: checklist });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Checklist not found' });
    }
    next(error);
  }
};

// Delete checklist
exports.deleteChecklist = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.checklist.delete({ where: { id } });

    res.json({ success: true, message: 'Checklist deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Checklist not found' });
    }
    next(error);
  }
};

// Create checklist item
exports.createChecklistItem = async (req, res, next) => {
  try {
    const { checklist_id, title } = req.body;

    const maxPosition = await prisma.checklistItem.aggregate({
      where: { checklistId: checklist_id },
      _max: { position: true },
    });
    const position = (maxPosition._max.position ?? -1) + 1;

    const item = await prisma.checklistItem.create({
      data: {
        checklistId: checklist_id,
        title,
        position,
      },
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// Update checklist item
exports.updateChecklistItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, is_completed } = req.body;

    const item = await prisma.checklistItem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(is_completed !== undefined && { isCompleted: is_completed }),
      },
    });

    res.json({ success: true, data: item });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Checklist item not found' });
    }
    next(error);
  }
};

// Delete checklist item
exports.deleteChecklistItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.checklistItem.delete({ where: { id } });

    res.json({ success: true, message: 'Checklist item deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Checklist item not found' });
    }
    next(error);
  }
};
