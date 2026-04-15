import { create } from "zustand";
import  type { Board } from "../types";
import { v4 as uuidv4 } from "uuid";

type BoardState = {
  board: Board;
  addCard: (columnId: string, title: string) => void;
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
      const newId = uuidv4();

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
}));