const prisma = require('../config/database');

// Create list
exports.createList = async (req, res, next) => {
  try {
    const { board_id, title } = req.body;

    // Get the next position
    const maxPosition = await prisma.list.aggregate({
      where: { boardId: board_id },
      _max: { position: true },
    });
    const position = (maxPosition._max.position ?? -1) + 1;

    const list = await prisma.list.create({
      data: {
        boardId: board_id,
        title,
        position,
      },
    });

    res.status(201).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

// Update list
exports.updateList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, color } = req.body;

    const list = await prisma.list.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(color !== undefined && { color }),
      },
    });

    res.json({ success: true, data: list });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'List not found' });
    }
    next(error);
  }
};

// Update list position
exports.updateListPosition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { position, board_id } = req.body;

    await prisma.$transaction(async (tx) => {
      // Get current list
      const currentList = await tx.list.findUnique({ where: { id } });
      if (!currentList) {
        throw new Error('List not found');
      }

      const oldPosition = currentList.position;

      if (oldPosition === position) {
        return currentList;
      }

      // Update positions of other lists
      if (position > oldPosition) {
        await tx.list.updateMany({
          where: {
            boardId: board_id,
            position: { gt: oldPosition, lte: position },
          },
          data: { position: { decrement: 1 } },
        });
      } else {
        await tx.list.updateMany({
          where: {
            boardId: board_id,
            position: { gte: position, lt: oldPosition },
          },
          data: { position: { increment: 1 } },
        });
      }

      // Update the moved list
      return await tx.list.update({
        where: { id },
        data: { position },
      });
    });

    const updatedList = await prisma.list.findUnique({ where: { id } });
    res.json({ success: true, data: updatedList });
  } catch (error) {
    next(error);
  }
};

// Delete list
exports.deleteList = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      // Get list info
      const list = await tx.list.findUnique({ where: { id } });
      if (!list) {
        throw new Error('List not found');
      }

      // Delete the list (cards will be deleted by CASCADE)
      await tx.list.delete({ where: { id } });

      // Update positions of remaining lists
      await tx.list.updateMany({
        where: {
          boardId: list.boardId,
          position: { gt: list.position },
        },
        data: { position: { decrement: 1 } },
      });
    });

    res.json({ success: true, message: 'List deleted successfully' });
  } catch (error) {
    if (error.message === 'List not found') {
      return res.status(404).json({ success: false, error: 'List not found' });
    }
    next(error);
  }
};
