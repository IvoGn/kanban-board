import { useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useBoardStore } from "../store/boardStore";
import Column from "./Column";

export default function Board() {
  const { board, moveCard, moveCardWithinColumn } = useBoardStore();

  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromColumn = active.data.current?.columnId as string;
    const toColumn = (over.data.current?.columnId ||
      over.id) as string;

    if (!fromColumn || !toColumn) {
      setActiveId(null);
      return;
    }

    if (fromColumn === toColumn) {
      if (activeId !== overId) {
        moveCardWithinColumn(fromColumn, activeId, overId);
      }
    } else {
      moveCard(activeId, fromColumn, toColumn);
    }

    setActiveId(null);
  };

  const activeCard =
    activeId && board.cards[activeId]
      ? board.cards[activeId]
      : null;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          return <Column key={column.id} column={column} />;
        })}
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="bg-white p-2 rounded shadow flex items-center gap-2">
            <span className="text-gray-400">☰</span>
            {activeCard.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}