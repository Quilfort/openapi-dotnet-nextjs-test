"use client";

import { FormEvent, useState } from "react";

import type {
    Department,
    DepartmentDto,
} from "@/generated/models";

type DepartmentFormProps = {
    initialData?: DepartmentDto;
    onSubmit: (department: Department) => Promise<void>;
    submitLabel?: string;
};

export default function DepartmentForm({
    initialData,
    onSubmit,
    submitLabel = "Afdeling aanmaken",
}: DepartmentFormProps) {
    const [name, setName] = useState(
        initialData?.name ?? ""
    );

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] = useState<string | null>(
        null
    );

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("Naam is verplicht.");
            return;
        }

        const department: Department = {
            id:
                initialData?.id ??
                crypto.randomUUID(),
            name: trimmedName,
        };

        try {
            setIsSubmitting(true);

            await onSubmit(department);
        } catch {
            setError(
                "Er is iets misgegaan bij het opslaan van de afdeling."
            );

            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-8"
        >
            <div className="rounded-2xl border border-border bg-surface p-6">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Afdeling
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Vul de naam van de afdeling in.
                    </p>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground"
                    >
                        Naam
                    </label>

                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        placeholder="Bijvoorbeeld: Financiën"
                        required
                        className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                </div>
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                >
                    {error}
                </div>
            )}

            <div className="border-t border-border pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Opslaan..."
                        : submitLabel}
                </button>
            </div>
        </form>
    );
}
