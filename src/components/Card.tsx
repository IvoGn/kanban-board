import type { Card as CardType } from "../types";

type Props = {
  card: CardType;
};

export default function Card({ card }: Props) {
  return (
    <div className="bg-white p-2 rounded shadow">
      {card.title}
    </div>
  );
}