import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useBoardStore } from "../store/boardStore";
import Column from "./Column";

export default function Board() {
  const { board, moveCard } = useBoardStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const cardId = active.id as string;
    const fromColumn = active.data.current?.columnId as string;
    const toColumn = over.id as string;

    if (!fromColumn || !toColumn) return;

    moveCard(cardId, fromColumn, toColumn);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          return <Column key={column.id} column={column} />;
        })}
      </div>
    </DndContext>
  );
}