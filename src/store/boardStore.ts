import { create } from "zustand";
import type { Board } from "../types";

// Backend endpoint used for optional server persistence.
const BACKEND_URL = "http://localhost:4000";

// Local storage key used to keep board state across reloads.
const LOCAL_STORAGE_KEY = "kanban-board-state";

// Default board state loaded when no saved state is available.
const defaultBoard: Board = {
  title: "Produkt-Launch-Board",
  columns: {
    "col-1": {
      id: "col-1",
      title: "Zu erledigen",
      titleKey: "columnTodo",
      cardIds: ["card-1"],
    },
    "col-2": {
      id: "col-2",
      title: "In Arbeit",
      titleKey: "columnDoing",
      cardIds: [],
    },
    "col-3": {
      id: "col-3",
      title: "Erledigt",
      titleKey: "columnDone",
      cardIds: [],
    },
  },
  cards: {
    "card-1": { id: "card-1", title: "Erste Aufgabe" },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
};

// Load board state from localStorage if present, otherwise fall back to default.
const loadSavedBoard = (): Board => {
  if (typeof window === "undefined") return defaultBoard;

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Board) : defaultBoard;
  } catch (error) {
    console.error("Failed to parse saved board:", error);
    return defaultBoard;
  }
};

type BoardState = {
  board: Board;
  loadBoard: () => Promise<void>;
  saveBoard: (board: Board) => Promise<void>;
  setBoard: (board: Board) => void;
  addCard: (columnId: string, title: string) => void;
  deleteCard: (cardId: string, columnId: string) => void;
  addSubtask: (cardId: string, title: string) => void;
  toggleSubtask: (cardId: string, subtaskId: string) => void;
  deleteSubtask: (cardId: string, subtaskId: string) => void;
  moveCard: (cardId: string, fromColumn: string, toColumn: string) => void;
  moveCardWithinColumn: (
    columnId: string,
    activeId: string,
    overId: string
  ) => void;
  setBoardTitle: (title: string) => void;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  board: loadSavedBoard(),

  // Try to load the board from the backend API and keep the local cache in sync.
  loadBoard: async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/board`);
      if (response.ok) {
        const data = await response.json();
        if (data?.board) {
          set({ board: data.board });
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(data.board)
          );
          return;
        }
      }
    } catch (error) {
      console.error("Failed to load board from backend:", error);
    }
  },

  // Persist board state locally and send it to the backend if available.
  saveBoard: async (board: Board) => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(board));
    } catch (error) {
      console.error("Failed to save board to localStorage:", error);
    }

    try {
      await fetch(`${BACKEND_URL}/board`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board }),
      });
    } catch (error) {
      console.error("Failed to save board to backend:", error);
    }
  },

  setBoard: (board: Board) => set({ board }),

  // Update the board title and save the new state.
  setBoardTitle: (title: string) =>
    set((state) => {
      const board = {
        ...state.board,
        title,
      };
      get().saveBoard(board);
      return { board };
    }),

  // Create a new card in the specified column and persist the updated board.
  addCard: (columnId: string, title: string) =>
    set((state) => {
      const newId = crypto.randomUUID();
      const board = {
        ...state.board,
        cards: {
          ...state.board.cards,
          [newId]: { id: newId, title, subtasks: [] },
        },
        columns: {
          ...state.board.columns,
          [columnId]: {
            ...state.board.columns[columnId],
            cardIds: [...state.board.columns[columnId].cardIds, newId],
          },
        },
      };

      get().saveBoard(board);
      return { board };
    }),

  // Add a subtask to the selected card and persist changes.
  addSubtask: (cardId: string, title: string) =>
    set((state) => {
      const card = state.board.cards[cardId];
      const subtaskId = crypto.randomUUID();
      const updatedCard = {
        ...card,
        subtasks: [
          ...(card.subtasks ?? []),
          { id: subtaskId, title, completed: false },
        ],
      };

      const board = {
        ...state.board,
        cards: {
          ...state.board.cards,
          [cardId]: updatedCard,
        },
      };

      get().saveBoard(board);
      return { board };
    }),

  // Toggle the completion status for a subtask.
  toggleSubtask: (cardId: string, subtaskId: string) =>
    set((state) => {
      const card = state.board.cards[cardId];
      const updatedCard = {
        ...card,
        subtasks: card.subtasks?.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        ),
      };

      const board = {
        ...state.board,
        cards: {
          ...state.board.cards,
          [cardId]: updatedCard,
        },
      };

      get().saveBoard(board);
      return { board };
    }),

  deleteSubtask: (cardId: string, subtaskId: string) =>
    set((state) => {
      const card = state.board.cards[cardId];
      const updatedCard = {
        ...card,
        subtasks: card.subtasks?.filter((subtask) => subtask.id !== subtaskId),
      };

      const board = {
        ...state.board,
        cards: {
          ...state.board.cards,
          [cardId]: updatedCard,
        },
      };

      get().saveBoard(board);
      return { board };
    }),

  // Remove a card and its reference from the column.
  deleteCard: (cardId: string, columnId: string) =>
    set((state) => {
      const newCards = { ...state.board.cards };
      delete newCards[cardId];
      const board = {
        ...state.board,
        cards: newCards,
        columns: {
          ...state.board.columns,
          [columnId]: {
            ...state.board.columns[columnId],
            cardIds: state.board.columns[columnId].cardIds.filter(
              (id) => id !== cardId
            ),
          },
        },
      };

      get().saveBoard(board);
      return { board };
    }),

  // Move a card from one column to another.
  moveCard: (cardId: string, fromColumn: string, toColumn: string) =>
    set((state) => {
      if (fromColumn === toColumn) return state;

      const board = {
        ...state.board,
        columns: {
          ...state.board.columns,
          [fromColumn]: {
            ...state.board.columns[fromColumn],
            cardIds: state.board.columns[fromColumn].cardIds.filter(
              (id) => id !== cardId
            ),
          },
          [toColumn]: {
            ...state.board.columns[toColumn],
            cardIds: [
              ...state.board.columns[toColumn].cardIds,
              cardId,
            ],
          },
        },
      };

      get().saveBoard(board);
      return { board };
    }),

  // Reorder cards within the same column.
  moveCardWithinColumn: (
    columnId: string,
    activeId: string,
    overId: string
  ) =>
    set((state) => {
      const column = state.board.columns[columnId];

      const oldIndex = column.cardIds.indexOf(activeId);
      const newIndex = column.cardIds.indexOf(overId);

      const newCardIds = [...column.cardIds];
      const [moved] = newCardIds.splice(oldIndex, 1);
      newCardIds.splice(newIndex, 0, moved);

      const board = {
        ...state.board,
        columns: {
          ...state.board.columns,
          [columnId]: {
            ...column,
            cardIds: newCardIds,
          },
        },
      };

      get().saveBoard(board);
      return { board };
    }),
}));