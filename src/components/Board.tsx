import { useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useBoardStore } from "../store/boardStore";
import Column from "./Column";

export default function Board() {
  const {
    board,
    moveCard,
    moveCardWithinColumn,
    setBoardTitle,
  } = useBoardStore();

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
      <div className="min-h-screen bg-slate-100 py-8">
        <div className="mx-auto w-full max-w-[1240px] px-4">
          <section className="mb-8 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm">
            <input
              value={board.title}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="w-full bg-transparent text-4xl font-semibold leading-tight text-slate-900 placeholder:text-slate-400 py-2 cursor-pointer focus:cursor-text focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="My project roadmap"
            />
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-slate-100/90 px-4 py-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              {board.columnOrder.map((columnId) => {
                const column = board.columns[columnId];
                return <Column key={column.id} column={column} />;
              })}
            </div>
          </section>
        </div>
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