import { create } from 'zustand';
import { api } from '@/services/api';

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Member {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

interface Card {
  id: string;
  list_id: string;
  title: string;
  description?: string;
  position: number;
  due_date?: string;
  cover_image?: string;
  labels: Label[];
  members: Member[];
}

interface List {
  id: string;
  board_id: string;
  title: string;
  position: number;
  cards: Card[];
}

interface Board {
  id: string;
  title: string;
  description?: string;
  backgroundColor: string;
  backgroundImage?: string;
  isStarred?: boolean;
  lists: List[];
  labels: Label[];
  members: Member[];
}

interface BoardStore {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
  
  // Search and Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Options for filter: member id array, label id array, due date boolean
  filterMembers: string[];
  filterLabels: string[];
  filterDueDate: boolean;
  setFilterMembers: (members: string[]) => void;
  setFilterLabels: (labels: string[]) => void;
  setFilterDueDate: (show: boolean) => void;

  // Actions
  fetchBoards: () => Promise<void>;
  fetchBoard: (id: string) => Promise<void>;
  createBoard: (data: any) => Promise<any>;
  updateBoard: (id: string, data: any) => Promise<void>;
  uploadBoardBackground: (id: string, file: File) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  
  // Lists
  createList: (boardId: string, title: string) => Promise<void>;
  updateList: (id: string, data: any) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  moveList: (id: string, position: number) => Promise<void>;
  
  // Cards
  createCard: (listId: string, title: string) => Promise<void>;
  updateCard: (id: string, data: any) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  moveCard: (id: string, listId: string, position: number) => Promise<void>;
  
  // Optimistic updates
  optimisticMoveCard: (cardId: string, sourceListId: string, destListId: string, destPosition: number) => void;
  optimisticMoveList: (listId: string, newPosition: number) => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  filterMembers: [],
  setFilterMembers: (members) => set({ filterMembers: members }),
  filterLabels: [],
  setFilterLabels: (labels) => set({ filterLabels: labels }),
  filterDueDate: false,
  setFilterDueDate: (show) => set({ filterDueDate: show }),

  fetchBoards: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.getBoards();
      set({ boards: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBoard: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.getBoard(id);
      set({ currentBoard: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createBoard: async (data: any) => {
    try {
      const response = await api.createBoard(data);
      set((state) => ({ boards: [response.data, ...state.boards] }));
      return response;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateBoard: async (id: string, data: any) => {
    try {
      const response = await api.updateBoard(id, data);
      set((state) => ({
        currentBoard: state.currentBoard?.id === id ? { ...state.currentBoard, ...response.data } : state.currentBoard,
        boards: state.boards.map((b) => (b.id === id ? { ...b, ...response.data } : b)),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  uploadBoardBackground: async (id: string, file: File) => {
    try {
      const response = await api.uploadBoardBackground(id, file);
      set((state) => ({
        currentBoard: state.currentBoard?.id === id ? { ...state.currentBoard, ...response.data.board } : state.currentBoard,
        boards: state.boards.map((b) => (b.id === id ? { ...b, ...response.data.board } : b)),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteBoard: async (id: string) => {
    try {
      await api.deleteBoard(id);
      set((state) => ({
        boards: state.boards.filter((b) => b.id !== id),
        currentBoard: state.currentBoard?.id === id ? null : state.currentBoard,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createList: async (boardId: string, title: string) => {
    try {
      const response = await api.createList({ board_id: boardId, title });
      set((state) => {
        if (state.currentBoard?.id === boardId) {
          return {
            currentBoard: {
              ...state.currentBoard,
              lists: [...(state.currentBoard.lists || []), { ...response.data, cards: [] }],
            },
          };
        }
        return state;
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateList: async (id: string, data: any) => {
    try {
      await api.updateList(id, data);
      set((state) => {
        if (state.currentBoard) {
          return {
            currentBoard: {
              ...state.currentBoard,
              lists: (state.currentBoard.lists || []).map((list) =>
                list.id === id ? { ...list, ...data } : list
              ),
            },
          };
        }
        return state;
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteList: async (id: string) => {
    try {
      await api.deleteList(id);
      set((state) => {
        if (state.currentBoard) {
          return {
            currentBoard: {
              ...state.currentBoard,
              lists: (state.currentBoard.lists || []).filter((list) => list.id !== id),
            },
          };
        }
        return state;
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  moveList: async (id: string, position: number) => {
    const { currentBoard } = get();
    if (!currentBoard) return;

    try {
      await api.updateListPosition(id, { position, board_id: currentBoard.id });
      // Refetch to get correct positions
      get().fetchBoard(currentBoard.id);
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createCard: async (listId: string, title: string) => {
    try {
      const response = await api.createCard({ list_id: listId, title });
      set((state) => {
        if (state.currentBoard) {
          return {
            currentBoard: {
              ...state.currentBoard,
              lists: (state.currentBoard.lists || []).map((list) =>
                list.id === listId
                  ? { ...list, cards: [...list.cards, { ...response.data, labels: [], members: [] }] }
                  : list
              ),
            },
          };
        }
        return state;
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateCard: async (id: string, data: any) => {
    try {
      await api.updateCard(id, data);
      set((state) => {
        if (state.currentBoard) {
          return {
            currentBoard: {
              ...state.currentBoard,
              lists: (state.currentBoard.lists || []).map((list) => ({
                ...list,
                cards: list.cards.map((card) =>
                  card.id === id ? { ...card, ...data } : card
                ),
              })),
            },
          };
        }
        return state;
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteCard: async (id: string) => {
    try {
      await api.deleteCard(id);
      set((state) => {
        if (state.currentBoard) {
          return {
            currentBoard: {
              ...state.currentBoard,
              lists: (state.currentBoard.lists || []).map((list) => ({
                ...list,
                cards: list.cards.filter((card) => card.id !== id),
              })),
            },
          };
        }
        return state;
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  moveCard: async (id: string, listId: string, position: number) => {
    try {
      await api.updateCardPosition(id, { list_id: listId, position });
    } catch (error: any) {
      set({ error: error.message });
      // Refetch on error to restore correct state
      const { currentBoard } = get();
      if (currentBoard) {
        get().fetchBoard(currentBoard.id);
      }
    }
  },

  optimisticMoveCard: (cardId: string, sourceListId: string, destListId: string, destPosition: number) => {
    set((state) => {
      if (!state.currentBoard) return state;

      const newLists = (state.currentBoard.lists || []).map((list) => ({ ...list, cards: [...list.cards] }));
      const sourceList = newLists.find((l) => l.id === sourceListId);
      const destList = newLists.find((l) => l.id === destListId);

      if (!sourceList || !destList) return state;

      const cardIndex = sourceList.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return state;

      const [card] = sourceList.cards.splice(cardIndex, 1);
      card.list_id = destListId;
      destList.cards.splice(destPosition, 0, card);

      // Update positions
      sourceList.cards.forEach((c, i) => (c.position = i));
      destList.cards.forEach((c, i) => (c.position = i));

      return {
        currentBoard: {
          ...state.currentBoard,
          lists: newLists,
        },
      };
    });
  },

  optimisticMoveList: (listId: string, newPosition: number) => {
    set((state) => {
      if (!state.currentBoard) return state;

      const lists = [...(state.currentBoard.lists || [])];
      const listIndex = lists.findIndex((l) => l.id === listId);
      if (listIndex === -1) return state;

      const [list] = lists.splice(listIndex, 1);
      lists.splice(newPosition, 0, list);

      lists.forEach((l, i) => (l.position = i));

      return {
        currentBoard: {
          ...state.currentBoard,
          lists,
        },
      };
    });
  },
}));
