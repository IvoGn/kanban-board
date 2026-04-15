import { useState } from "react";
import type { Column as ColumnType } from "../types";
import { useBoardStore } from "../store/boardStore";
import Card from "./Card";

type Props = {
  column: ColumnType;
};

export default function Column({ column }: Props) {
  const { board, addCard } = useBoardStore();
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    addCard(column.id, title);
    setTitle("");
  };

  return (
    <div className="bg-gray-100 rounded p-3 w-64">
      <h2 className="font-bold mb-2">{column.title}</h2>

      <div className="flex flex-col gap-2 mb-2">
        {column.cardIds.map((cardId) => {
          const card = board.cards[cardId];
          return <Card key={card.id} card={card} />;
        })}
      </div>

      <input
        className="w-full p-1 mb-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task..."
      />

      <button
        onClick={handleAdd}
        className="w-full bg-blue-500 text-white p-1 rounded"
      >
        Add
      </button>
    </div>
  );
}