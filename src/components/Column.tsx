import { useState } from "react";
import type { Column as ColumnType } from "../types";
import { useBoardStore } from "../store/boardStore";
import { useTranslation } from "../LanguageContext";
import Card from "./Card";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  column: ColumnType;
};

export default function Column({ column }: Props) {
  const { board, addCard } = useBoardStore();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);

  // Local column state for the add-task form.
  // showAddTask controls whether the input and buttons appear.

  const defaultColumnTitles: Record<string, "columnTodo" | "columnDoing" | "columnDone"> = {
    "col-1": "columnTodo",
    "col-2": "columnDoing",
    "col-3": "columnDone",
  };

  // Column heading is chosen from a translation key if present,
  // otherwise use a default mapping or fallback to the stored title.
  const columnHeading = column.titleKey
    ? t(column.titleKey)
    : defaultColumnTitles[column.id]
    ? t(defaultColumnTitles[column.id])
    : column.title;

  // Register this column as a drop target for cards.
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      columnId: column.id,
    },
  });

  const handleAdd = () => {
    if (!title.trim()) return;
    addCard(column.id, title);
    setTitle("");
    setShowAddTask(false);
  };

  // Add a new card to this column and reset the add form.

  return (
    <div
      ref={setNodeRef}
      className="w-full rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50"
    >
      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3">
        <h2 className="text-lg font-semibold text-slate-900">{columnHeading}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          {column.cardIds.length}
        </span>
      </div>

      <SortableContext
        items={column.cardIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 mb-2">
          {column.cardIds.map((cardId) => {
            const card = board.cards[cardId];
            return (
              <Card
                key={card.id}
                card={card}
                columnId={column.id}
              />
            );
          })}
        </div>
      </SortableContext>

      {column.cardIds.length === 0 && (
        <p className="text-sm text-slate-500 mb-4">{t("noTasks")}</p>
      )}

      {showAddTask ? (
        <div className="space-y-2">
          <input
            className="w-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 rounded-lg outline-none transition focus:border-slate-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder={t("addNewTaskPlaceholder")}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 rounded-lg bg-slate-900 text-white px-3 py-2 text-sm font-medium transition hover:bg-slate-800 cursor-pointer"
            >
              {t("addTask")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddTask(false);
                setTitle("");
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddTask(true)}
          className="flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <span className="text-lg">+</span>
          {t("addNewTaskButton")}
        </button>
      )}
    </div>
  );
}