import { useEffect } from "react";
import { useTranslation } from "../LanguageContext";

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
  title,
  message,
}: Props) {
  const { t } = useTranslation();
  const modalTitle = title ?? t("deleteTaskTitle");
  const modalMessage = message ?? t("deleteTaskMessage");

  // Confirmation dialog with localized text and keyboard handling.
  // It closes when clicking outside, pressing Escape, or choosing cancel.
  useEffect(() => {
    // Close the dialog when Escape is pressed.
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
    // The overlay closes the modal when clicked outside the dialog.
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg p-4 w-80 shadow-lg flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold">{modalTitle}</h2>

        <p className="text-sm text-gray-600">{modalMessage}</p>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            className="w-1/2 px-3 py-2 rounded-md bg-gray-100 text-slate-700 hover:bg-gray-200 cursor-pointer"
          >
            {t("cancel")}
          </button>

          <button
            onClick={onConfirm}
            className="w-1/2 px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 cursor-pointer"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}