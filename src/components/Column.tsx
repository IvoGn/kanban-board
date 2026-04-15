import type { Column as ColumnType } from "../types";
import { useBoardStore } from "../store/boardStore";
import Card from "./Card";

type Props = {
  column: ColumnType;
};

export default function Column({ column }: Props) {
  const { board } = useBoardStore();

  return (
    <div className="bg-gray-100 rounded p-3 w-64">
      <h2 className="font-bold mb-2">{column.title}</h2>

      <div className="flex flex-col gap-2">
        {column.cardIds.map((cardId) => {
          const card = board.cards[cardId];
          return <Card key={card.id} card={card} />;
        })}
      </div>
    </div>
  );
}