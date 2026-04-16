import type { Card as CardType } from "../types";
import { useBoardStore } from "../store/boardStore";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

type Props = {
  card: CardType;
  columnId: string;
};

export default function Card({ card, columnId }: Props) {
  const { deleteCard, addSubtask, toggleSubtask, deleteSubtask } = useBoardStore();
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const [showModal, setShowModal] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded shadow transition text-slate-950 hover:ring-2 hover:ring-blue-500"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2 text-slate-950 text-sm font-semibold">
          <span
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing text-gray-400"
          >
            ☰
          </span>
          {card.title}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-100 text-red-500 hover:text-red-600 transition cursor-pointer"
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 w-full">
        {card.subtasks && card.subtasks.length > 0 ? (
          <div className="mb-2 flex items-center justify-between gap-2 text-sm text-slate-500">
            <span>
              {card.subtasks.filter((subtask) => subtask.completed).length}/{card.subtasks.length} done
            </span>
          </div>
        ) : null}

        <div className="space-y-2 mb-3">
          {(card.subtasks ?? []).map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-800"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => toggleSubtask(card.id, subtask.id)}
                  className="h-4 w-4 cursor-pointer text-slate-900 transition"
                />
                <span className={subtask.completed ? "line-through text-slate-400" : ""}>
                  {subtask.title}
                </span>
              </label>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSubtask(card.id, subtask.id);
                }}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Delete subtask"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {showAddTask ? (
          <div className="space-y-2">
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
              placeholder="Enter subtask..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (subtaskTitle.trim()) {
                    addSubtask(card.id, subtaskTitle.trim());
                    setSubtaskTitle("");
                    setShowAddTask(false);
                  }
                }
              }}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!subtaskTitle.trim()) return;
                  addSubtask(card.id, subtaskTitle.trim());
                  setSubtaskTitle("");
                  setShowAddTask(false);
                }}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 cursor-pointer"
              >
                Add subtask
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTask(false);
                  setSubtaskTitle("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 cursor-pointer"
              >
                Cancel
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
            Add a new subtask
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={() => {
          deleteCard(card.id, columnId);
          setShowModal(false);
        }}
      />
    </div>
  );
}