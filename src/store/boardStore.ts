import { create } from "zustand";
import type { Board } from "../types";

type BoardState = {
  board: Board;
};

export const useBoardStore = create<BoardState>(() => ({
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
}));