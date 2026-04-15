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
    <div ref={setNodeRef} className="bg-gray-100 rounded p-3 w-64">
      <h2 className="font-bold mb-2">{column.title}</h2>

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
        <p className="text-sm text-gray-400 mb-2">No tasks</p>
      )}

      <input
        className="w-full p-1 mb-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
        placeholder="New task..."
      />

      <button
        onClick={handleAdd}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
      >
        Add
      </button>
    </div>
  );
}