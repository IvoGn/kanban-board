import { create } from "zustand";
import type { Board } from "../types";

const BACKEND_URL = "http://localhost:4000";
const LOCAL_STORAGE_KEY = "kanban-board-state";

const defaultBoard: Board = {
  title: "Product Launch Board",
  columns: {
    "col-1": { id: "col-1", title: "Todo", cardIds: ["card-1"] },
    "col-2": { id: "col-2", title: "Doing", cardIds: [] },
    "col-3": { id: "col-3", title: "Done", cardIds: [] },
  },
  cards: {
    "card-1": { id: "card-1", title: "First Task" },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
};

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

  setBoardTitle: (title: string) =>
    set((state) => {
      const board = {
        ...state.board,
        title,
      };
      get().saveBoard(board);
      return { board };
    }),

  addCard: (columnId: string, title: string) =>
    set((state) => {
      const newId = crypto.randomUUID();
      const board = {
        ...state.board,
        cards: {
          ...state.board.cards,
          [newId]: { id: newId, title },
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