"use client";

import { useState } from "react";

import ConfirmModal from "./ConfirmModal";

type DeleteButtonProps = {
    onDelete: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
};

export default function DeleteButton({
    onDelete,
    title = "Item verwijderen?",
    description = "Weet je zeker dat je dit item wilt verwijderen? Deze actie kan niet ongedaan worden.",
    confirmLabel = "Verwijderen",
    cancelLabel = "Annuleren",
}: DeleteButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleCancel() {
        setIsModalOpen(false);
    }

    function handleConfirm() {
        setIsModalOpen(false);
        onDelete();
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
            >
                Verwijderen
            </button>

            <ConfirmModal
                isOpen={isModalOpen}
                title={title}
                description={description}
                confirmLabel={confirmLabel}
                cancelLabel={cancelLabel}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
}