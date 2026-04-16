import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
};

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Delete task",
  message = "Are you sure you want to delete this task?",
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg p-4 w-80 shadow-lg flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="text-sm text-gray-600">{message}</p>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            className="w-1/2 px-3 py-2 rounded-md bg-gray-100 text-slate-700 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-1/2 px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}