import { useEffect, useState } from "react";
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
  const [title, setTitle] = useState(board.title);

  useEffect(() => {
    setTitle(board.title);
  }, [board.title]);

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
        <div className="w-full px-4">
          <div className="mx-auto max-w-[1480px] rounded-[2rem] bg-white p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.15)]">
            <section className="mb-8 rounded-[1.75rem] bg-slate-100 p-6">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setBoardTitle(title)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setBoardTitle(title);
                  }
                }}
                className="w-full bg-transparent text-4xl font-semibold leading-tight text-slate-900 placeholder:text-slate-500 py-3 cursor-pointer focus:cursor-text focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="My project roadmap"
              />
            </section>

            <section className="rounded-[1.75rem] bg-slate-100 px-4 py-5">
              <div className="grid gap-4 md:grid-cols-3">
                {board.columnOrder.map((columnId) => {
                  const column = board.columns[columnId];
                  return <Column key={column.id} column={column} />;
                })}
              </div>
            </section>
          </div>
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