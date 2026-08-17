"use client";

import { useState } from "react";

import ConfirmModal from "./ConfirmModal";

type DeleteButtonProps = {
    onDelete: () => void;
};

export default function DeleteButton({
    onDelete,
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
                title="Agenda item verwijderen?"
                description="Weet je zeker dat je dit agenda item wilt verwijderen? Deze actie kan niet ongedaan worden."
                confirmLabel="Verwijderen"
                cancelLabel="Annuleren"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
}