import { create } from "zustand";
import type { Board } from "../types";

type BoardState = {
  board: Board;
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

export const useBoardStore = create<BoardState>((set) => ({
  board: {
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
  },

  setBoardTitle: (title) =>
    set((state) => ({
      board: {
        ...state.board,
        title,
      },
    })),

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

  moveCard: (cardId, fromColumn, toColumn) =>
    set((state) => {
      if (fromColumn === toColumn) return state;

      return {
        board: {
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
        },
      };
    }),

  moveCardWithinColumn: (columnId, activeId, overId) =>
    set((state) => {
      const column = state.board.columns[columnId];

      const oldIndex = column.cardIds.indexOf(activeId);
      const newIndex = column.cardIds.indexOf(overId);

      const newCardIds = [...column.cardIds];
      const [moved] = newCardIds.splice(oldIndex, 1);
      newCardIds.splice(newIndex, 0, moved);

      return {
        board: {
          ...state.board,
          columns: {
            ...state.board.columns,
            [columnId]: {
              ...column,
              cardIds: newCardIds,
            },
          },
        },
      };
    }),
}));