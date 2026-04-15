import { create } from "zustand";
import  type { Board } from "../types";

type BoardState = {
  board: Board;
  addCard: (columnId: string, title: string) => void;
  deleteCard: (cardId: string, columnId: string) => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: {
      "col-1": { id: "col-1", title: "Todo", cardIds: ["card-1"] },
      "col-2": { id: "col-2", title: "Doing", cardIds: [] },
      "col-3": { id: "col-3", title: "Done", cardIds: [] },
    },
    cards: {
      "card-1": { id: "card-1", title: "First Task" },
    },
    columnOrder: ["col-1", "col-2", "col-3"],
  },

  addCard: (columnId, title) =>
    set((state) => {
      const newId = crypto.randomUUID();

      return {
        board: {
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
        },
      };
    }),

  deleteCard: (cardId, columnId) =>
    set((state) => {
      const newCards = { ...state.board.cards };
      delete newCards[cardId];

      return {
        board: {
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
        },
      };
    }),
}));