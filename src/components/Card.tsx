import { useDraggable } from "@dnd-kit/core";
import type { Card as CardType } from "../types";
import { useBoardStore } from "../store/boardStore";

type Props = {
  card: CardType;
  columnId: string;
};

export default function Card({ card, columnId }: Props) {
  const { deleteCard } = useBoardStore();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
    data: {
      columnId,
    },
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
   <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-2 rounded shadow flex justify-between items-center hover:bg-gray-50"
    >
      <span className="flex items-center gap-2">
        {/* Drag Handle */}
        <span
        {...listeners}
        {...attributes}
        className="cursor-grab text-gray-400"
        >
        ☰
        </span>

        {card.title}
      </span>

      <button
        onClick={() => deleteCard(card.id, columnId)}
        className="text-red-500 text-sm"
      >
        ✕
      </button>
    </div>
  );
}