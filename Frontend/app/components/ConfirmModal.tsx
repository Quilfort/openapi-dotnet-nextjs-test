"use client";

type ConfirmModalProps = {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    isOpen,
    title,
    description,
    confirmLabel = "Bevestigen",
    cancelLabel = "Annuleren",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
                <h2
                    id="confirm-modal-title"
                    className="text-xl font-semibold tracking-tight text-foreground"
                >
                    {title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-muted">
                    {description}
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}