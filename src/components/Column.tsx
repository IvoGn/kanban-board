import { useState } from "react";
import type { Column as ColumnType } from "../types";
import { useBoardStore } from "../store/boardStore";
import Card from "./Card";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  column: ColumnType;
};

export default function Column({ column }: Props) {
  const { board, addCard } = useBoardStore();
  const [title, setTitle] = useState("");

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      columnId: column.id,
    },
  });

  const handleAdd = () => {
    if (!title.trim()) return;
    addCard(column.id, title);
    setTitle("");
  };

  return (
    <div
      ref={setNodeRef}
      className="w-full rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50"
    >
      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3">
        <h2 className="text-lg font-semibold text-slate-900">{column.title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          {column.cardIds.length}
        </span>
      </div>

      <SortableContext
        items={column.cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 mb-2">
          {column.cardIds.map((cardId) => {
            const card = board.cards[cardId];
            return (
              <Card
                key={card.id}
                card={card}
                columnId={column.id}
              />
            );
          })}
        </div>
      </SortableContext>

      {column.cardIds.length === 0 && (
        <p className="text-sm text-slate-500 mb-4">No tasks</p>
      )}

      <input
        className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 rounded-lg outline-none transition focus:border-slate-300"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
        placeholder="New task..."
      />

      <button
        onClick={handleAdd}
        className="mt-3 w-full bg-slate-900 text-white px-3 py-2 rounded-lg transition hover:bg-slate-800"
      >
        Add task
      </button>
    </div>
  );
}