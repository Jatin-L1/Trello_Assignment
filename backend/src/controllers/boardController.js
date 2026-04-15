const prisma = require('../config/database');

// Get all boards
exports.getAllBoards = async (req, res, next) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        createdBy: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json({ success: true, data: boards });
  } catch (error) {
    next(error);
  }
};

// Get board by ID with lists and cards
exports.getBoardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            username: true,
            fullName: true,
          },
        },
        lists: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              where: { isArchived: false },
              orderBy: { position: 'asc' },
              include: {
                createdBy: {
                  select: {
                    username: true,
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
              },
            },
          },
        },
        boardMembers: {
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
        labels: {
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }

    // Transform data to match frontend expectations
    const transformedBoard = {
      ...board,
      lists: board.lists.map(list => ({
        ...list,
        cards: list.cards.map(card => ({
          ...card,
          labels: card.cardLabels.map(cl => cl.label),
          members: card.cardMembers.map(cm => cm.user),
        })),
      })),
      members: board.boardMembers.map(bm => ({
        ...bm.user,
        role: bm.role,
      })),
    };

    res.json({ success: true, data: transformedBoard });
  } catch (error) {
    next(error);
  }
};

// Create board
exports.createBoard = async (req, res, next) => {
  try {
    const { title, description, background_color, background_image, created_by } = req.body;

    const board = await prisma.board.create({
      data: {
        title,
        description,
        backgroundColor: background_color || '#0079bf',
        backgroundImage: background_image,
        createdById: created_by || '11111111-1111-1111-1111-111111111111',
      },
    });

    res.status(201).json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
};

// Update board
exports.updateBoard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, background_color, background_image, is_starred } = req.body;

    const board = await prisma.board.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(background_color && { backgroundColor: background_color }),
        ...(background_image !== undefined && { backgroundImage: background_image }),
        ...(is_starred !== undefined && { isStarred: is_starred }),
      },
    });

    res.json({ success: true, data: board });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }
    next(error);
  }
};

// Delete board
exports.deleteBoard = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.board.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Board deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Board not found' });
    }
    next(error);
  }
};
