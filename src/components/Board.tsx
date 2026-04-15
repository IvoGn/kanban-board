import { useBoardStore } from "../store/boardStore";
import Column from "./Column";

export default function Board() {
  const { board } = useBoardStore();

  return (
    <div className="flex gap-4 p-4">
      {board.columnOrder.map((columnId) => {
        const column = board.columns[columnId];
        return <Column key={column.id} column={column} />;
      })}
    </div>
  );
}