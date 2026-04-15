export type Card = {
  id: string;
  title: string;
  description?: string;
};

export type Column = {
  id: string;
  title: string;
  cardIds: string[];
};

export type Board = {
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  columnOrder: string[];
};