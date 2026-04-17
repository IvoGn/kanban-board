import { useEffect, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useBoardStore } from "../store/boardStore";
import Column from "./Column";
import LanguageSwitch from "./LanguageSwitch";
import { useTranslation } from "../LanguageContext";

// The main board component renders the page title, the language switch,
// and the three columns with drag-and-drop support.
export default function Board() {
  const {
    board,
    moveCard,
    moveCardWithinColumn,
    setBoardTitle,
  } = useBoardStore();
  const { t } = useTranslation();

  // Board state is loaded from store and updates via drag-and-drop events.

  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState(board.title);

  // Keep the local title field in sync with the board store title.
  useEffect(() => {
    setTitle(board.title);
  }, [board.title]);

  // Remember which card is currently being dragged.
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // When the drag ends, determine whether the card moved within the same
  // column or to a different column and update the store accordingly.
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
            <div className="mb-4 flex justify-end">
              <LanguageSwitch />
            </div>
            <section className="mb-8 rounded-[1.75rem] bg-slate-100 p-6">
              {/* Board title is editable and saved when focus leaves or Enter is pressed. */}
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
                placeholder={t("boardTitlePlaceholder")}
              />
            </section>

            <section className="rounded-[1.75rem] bg-slate-100 px-4 py-5">
              {/* Render columns in the order specified by the board state. */}
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
          <div className="bg-white p-2 rounded shadow flex items-center gap-2 text-slate-950">
            {/* Drag overlay shows the card title while dragging. */}
            <span className="text-gray-400">☰</span>
            {activeCard.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}