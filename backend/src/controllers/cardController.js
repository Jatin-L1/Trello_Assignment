const prisma = require('../config/database');

// Get card by ID with full details
exports.getCardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            username: true,
            fullName: true,
          },
        },
        list: {
          select: {
            title: true,
            boardId: true,
          },
        },
        cardLabels: {
          include: {
            label: true,
          },
        },
        cardMembers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        checklists: {
          orderBy: { position: 'asc' },
          include: {
            items: {
              orderBy: { position: 'asc' },
            },
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                username: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        attachments: {
          orderBy: { createdAt: 'desc' },
          include: {
            uploadedBy: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!card) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }

    // Transform data
    const transformedCard = {
      ...card,
      list_title: card.list.title,
      board_id: card.list.boardId,
      labels: card.cardLabels.map((cl) => cl.label),
      members: card.cardMembers.map((cm) => cm.user),
    };

    res.json({ success: true, data: transformedCard });
  } catch (error) {
    next(error);
  }
};

// Create card
exports.createCard = async (req, res, next) => {
  try {
    const { list_id, title, description, created_by } = req.body;

    // Get next position
    const maxPosition = await prisma.card.aggregate({
      where: { listId: list_id, isArchived: false },
      _max: { position: true },
    });
    const position = (maxPosition._max.position ?? -1) + 1;

    const card = await prisma.card.create({
      data: {
        listId: list_id,
        title,
        description,
        position,
        createdById: created_by || '11111111-1111-1111-1111-111111111111',
      },
    });

    res.status(201).json({ success: true, data: card });
  } catch (error) {
    next(error);
  }
};

// Update card
exports.updateCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, cover_image, is_archived } = req.body;

    const card = await prisma.card.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(due_date !== undefined && { dueDate: due_date ? new Date(due_date) : null }),
        ...(cover_image !== undefined && { coverImage: cover_image }),
        ...(is_archived !== undefined && { isArchived: is_archived }),
      },
    });

    res.json({ success: true, data: card });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    next(error);
  }
};

// Update card position (drag and drop)
exports.updateCardPosition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { list_id, position } = req.body;

    await prisma.$transaction(async (tx) => {
      // Get current card
      const currentCard = await tx.card.findUnique({ where: { id } });
      if (!currentCard) {
        throw new Error('Card not found');
      }

      const oldListId = currentCard.listId;
      const oldPosition = currentCard.position;

      // Same list reorder
      if (oldListId === list_id) {
        if (oldPosition === position) {
          return currentCard;
        }

        if (position > oldPosition) {
          await tx.card.updateMany({
            where: {
              listId: list_id,
              position: { gt: oldPosition, lte: position },
              isArchived: false,
            },
            data: { position: { decrement: 1 } },
          });
        } else {
          await tx.card.updateMany({
            where: {
              listId: list_id,
              position: { gte: position, lt: oldPosition },
              isArchived: false,
            },
            data: { position: { increment: 1 } },
          });
        }
      } else {
        // Moving to different list
        // Update old list positions
        await tx.card.updateMany({
          where: {
            listId: oldListId,
            position: { gt: oldPosition },
            isArchived: false,
          },
          data: { position: { decrement: 1 } },
        });

        // Update new list positions
        await tx.card.updateMany({
          where: {
            listId: list_id,
            position: { gte: position },
            isArchived: false,
          },
          data: { position: { increment: 1 } },
        });
      }

      // Update the moved card
      return await tx.card.update({
        where: { id },
        data: { listId: list_id, position },
      });
    });

    const updatedCard = await prisma.card.findUnique({ where: { id } });
    res.json({ success: true, data: updatedCard });
  } catch (error) {
    if (error.message === 'Card not found') {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    next(error);
  }
};

// Delete card
exports.deleteCard = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      const card = await tx.card.findUnique({ where: { id } });
      if (!card) {
        throw new Error('Card not found');
      }

      await tx.card.delete({ where: { id } });

      await tx.card.updateMany({
        where: {
          listId: card.listId,
          position: { gt: card.position },
          isArchived: false,
        },
        data: { position: { decrement: 1 } },
      });
    });

    res.json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    if (error.message === 'Card not found') {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    next(error);
  }
};

// Search cards
exports.searchCards = async (req, res, next) => {
  try {
    const { board_id, query, label_ids, member_ids, due_date_filter } = req.query;

    const where = {
      list: { boardId: board_id },
      isArchived: false,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (label_ids) {
      where.cardLabels = {
        some: {
          labelId: { in: label_ids.split(',') },
        },
      };
    }

    if (member_ids) {
      where.cardMembers = {
        some: {
          userId: { in: member_ids.split(',') },
        },
      };
    }

    if (due_date_filter) {
      const now = new Date();
      if (due_date_filter === 'overdue') {
        where.dueDate = { lt: now };
      } else if (due_date_filter === 'today') {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        where.dueDate = { gte: now, lt: tomorrow };
      } else if (due_date_filter === 'week') {
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        where.dueDate = { gte: now, lte: nextWeek };
      }
    }

    const cards = await prisma.card.findMany({
      where,
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const transformedCards = cards.map((card) => ({
      ...card,
      list_title: card.list.title,
    }));

    res.json({ success: true, data: transformedCards });
  } catch (error) {
    next(error);
  }
};
