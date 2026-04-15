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
      {...listeners}
      {...attributes}
      className="bg-white p-2 rounded shadow flex justify-between items-center hover:bg-gray-50 cursor-grab"
    >
      <span>{card.title}</span>

      <button
        onClick={() => deleteCard(card.id, columnId)}
        className="text-red-500 text-sm"
      >
        ✕
      </button>
    </div>
  );
}