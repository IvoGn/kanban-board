import type { Card as CardType } from "../types";
import { useBoardStore } from "../store/boardStore";
import { useTranslation } from "../LanguageContext";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

type Props = {
  card: CardType;
  columnId: string;
};

export default function Card({ card, columnId }: Props) {
  const {
    deleteCard,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    setCardTitle,
    setSubtaskTitle,
  } = useBoardStore();
  const { t } = useTranslation();
  const [subtaskTitleInput, setSubtaskTitleInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(card.title);
  const [subtaskInputs, setSubtaskInputs] = useState<Record<string, string>>({});

  // Each card has its own local UI state for adding subtasks and showing modals.

  useEffect(() => {
    if (!isEditing) {
      setTitleInput(card.title);
      setSubtaskInputs(
        Object.fromEntries((card.subtasks ?? []).map((subtask) => [subtask.id, subtask.title]))
      );
    }
  }, [card.title, card.subtasks, isEditing]);

  // Make this card draggable with dnd-kit sortable support.
  // Enable drag-and-drop behavior for this card.
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

  // Apply drag styles while the card is being moved.

  const [showModal, setShowModal] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  // The confirmation modal is shown when the delete button is clicked.
  // showAddTask toggles the inline subtask form.

  const saveCardTitle = () => {
    const trimmed = titleInput.trim();
    if (trimmed && trimmed !== card.title) {
      setCardTitle(card.id, trimmed);
    }
    setTitleInput(card.title);
  };

  const saveSubtaskTitle = (subtaskId: string) => {
    const title = subtaskInputs[subtaskId]?.trim() ?? "";
    if (!title) {
      const original = card.subtasks?.find((subtask) => subtask.id === subtaskId)?.title;
      setSubtaskInputs((prev) => ({
        ...prev,
        [subtaskId]: original ?? "",
      }));
      return;
    }

    const subtask = card.subtasks?.find((subtask) => subtask.id === subtaskId);
    if (subtask && subtask.title !== title) {
      setSubtaskTitle(card.id, subtaskId, title);
    }
  };

  const saveAllEdits = () => {
    saveCardTitle();
    (card.subtasks ?? []).forEach((subtask) => saveSubtaskTitle(subtask.id));
  };

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
          {isEditing ? (
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={saveCardTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveCardTitle();
                }
              }}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400"
            />
          ) : (
            card.title
          )}
        </span>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  saveAllEdits();
                  setIsEditing(false);
                }}
                className="rounded-full bg-slate-900 text-white w-8 h-8 flex items-center justify-center hover:bg-slate-800 transition"
                aria-label={t("saveTaskAria")}
              >
                ✓
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModal(true);
                }}
                className="rounded-full bg-red-100 text-red-600 w-8 h-8 flex items-center justify-center hover:bg-red-200 transition"
                aria-label={t("deleteTaskAria")}
              >
                ✕
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setTitleInput(card.title);
                setSubtaskInputs(
                  Object.fromEntries((card.subtasks ?? []).map((subtask) => [subtask.id, subtask.title]))
                );
              }}
              className="rounded-full bg-slate-100 text-slate-700 w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition"
              aria-label={t("editTaskAria")}
            >
              ✎
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 w-full">
        {/* Show a completion summary only when subtasks exist. */}
        {card.subtasks && card.subtasks.length > 0 ? (
          <div className="mb-2 flex items-center justify-between gap-2 text-sm text-slate-500">
            <span>
              {card.subtasks.filter((subtask) => subtask.completed).length}/{card.subtasks.length} {t("doneLabel")}
            </span>
          </div>
        ) : null}

        <div className="space-y-2 mb-3">
          {(card.subtasks ?? []).map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-800"
            >
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => toggleSubtask(card.id, subtask.id)}
                  className="h-4 w-4 cursor-pointer text-slate-900 transition"
                />
                {isEditing ? (
                  <input
                    value={subtaskInputs[subtask.id] ?? subtask.title}
                    onChange={(e) =>
                      setSubtaskInputs((prev) => ({
                        ...prev,
                        [subtask.id]: e.target.value,
                      }))
                    }
                    onBlur={() => saveSubtaskTitle(subtask.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveSubtaskTitle(subtask.id);
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                ) : (
                  <span className={subtask.completed ? "line-through text-slate-400" : ""}>
                    {subtask.title}
                  </span>
                )}
              </label>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSubtask(card.id, subtask.id);
                }}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label={t("deleteSubtaskAria")}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Render the add-subtask form when the button is clicked. */}
        {showAddTask ? (
          <div className="space-y-2">
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              value={subtaskTitleInput}
              onChange={(e) => setSubtaskTitleInput(e.target.value)}
              placeholder={t("enterSubtaskPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (subtaskTitleInput.trim()) {
                    addSubtask(card.id, subtaskTitleInput.trim());
                    setSubtaskTitleInput("");
                    setShowAddTask(false);
                  }
                }
              }}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!subtaskTitleInput.trim()) return;
                  addSubtask(card.id, subtaskTitleInput.trim());
                  setSubtaskTitleInput("");
                  setShowAddTask(false);
                }}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 cursor-pointer"
              >
                {t("addSubtask")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddTask(false);
                  setSubtaskTitleInput("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 cursor-pointer"
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
            {t("addSubtask")}
          </button>
        )}
      </div>

      {/* Confirmation modal to prevent accidental card deletion. */}
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