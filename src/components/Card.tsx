import type { Card as CardType } from "../types";
import { useBoardStore } from "../store/boardStore";

type Props = {
  card: CardType;
  columnId: string;
};

export default function Card({ card, columnId }: Props) {
  const { deleteCard } = useBoardStore();

  return (
    <div className="bg-white p-2 rounded shadow flex justify-between items-center">
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