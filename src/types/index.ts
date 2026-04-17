export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Card = {
  id: string;
  title: string;
  description?: string;
  subtasks?: Subtask[];
};

export type Column = {
  id: string;
  title: string;
  titleKey?: "columnTodo" | "columnDoing" | "columnDone";
  cardIds: string[];
};

export type Board = {
  title: string;
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  columnOrder: string[];
};