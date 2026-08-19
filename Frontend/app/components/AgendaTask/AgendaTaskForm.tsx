"use client";

import { FormEvent, useMemo, useState } from "react";

import type {
    Agenda,
    AgendaItem,
    AgendaTask,
} from "@/generated/models";

type AgendaTaskFormProps = {
    agendas: Agenda[];
    agendaItems: AgendaItem[];
    initialData?: AgendaTask;
    onSubmit: (agendaTask: AgendaTask) => Promise<void>;
    submitLabel?: string;
};

export default function AgendaTaskForm({
    agendas,
    agendaItems,
    initialData,
    onSubmit,
    submitLabel = "Taak aanmaken",
}: AgendaTaskFormProps) {
    const [agendaId, setAgendaId] = useState(
        initialData?.agendaItem?.agendaId ?? ""
    );

    const [agendaItemId, setAgendaItemId] = useState(
        initialData?.agendaItemId ?? ""
    );

    const [name, setName] = useState(
        initialData?.name ?? ""
    );

    const [description, setDescription] = useState(
        initialData?.description ?? ""
    );

    const [deadlineDate, setDeadlineDate] = useState(
        initialData?.deadlineDate ?? ""
    );

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] = useState<string | null>(
        null
    );

    const filteredAgendaItems = useMemo(() => {
        if (!agendaId) {
            return [];
        }

        return agendaItems.filter(
            (agendaItem) =>
                agendaItem.agendaId === agendaId
        );
    }, [agendaId, agendaItems]);

    function handleAgendaChange(value: string) {
        setAgendaId(value);

        // Een agenda wijziging maakt het eerder
        // geselecteerde agenda item ongeldig.
        setAgendaItemId("");
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);

        if (!name.trim()) {
            setError("Naam is verplicht.");
            return;
        }

        if (!agendaId) {
            setError("Selecteer eerst een agenda.");
            return;
        }

        if (!agendaItemId) {
            setError("Selecteer een agenda item.");
            return;
        }

        if (!deadlineDate) {
            setError("Deadline is verplicht.");
            return;
        }

        const agendaTask: AgendaTask = {
            ...(initialData?.id
                ? {
                      id: initialData.id,
                  }
                : {}),
            name: name.trim(),
            description:
                description.trim() || null,
            deadlineDate,
            agendaItemId,
        };

        try {
            setIsSubmitting(true);

            await onSubmit(agendaTask);
        } catch {
            setError(
                "Er is iets misgegaan bij het opslaan van de taak."
            );
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-8"
        >
            {/* Relation */}
            <div className="rounded-2xl border border-border bg-surface p-6">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Koppeling
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Kies eerst de agenda en daarna het agenda
                        item waaraan deze taak gekoppeld wordt.
                    </p>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {/* Agenda */}
                    <div>
                        <label
                            htmlFor="agenda"
                            className="block text-sm font-medium text-foreground"
                        >
                            Agenda
                        </label>

                        <select
                            id="agenda"
                            value={agendaId}
                            onChange={(event) =>
                                handleAgendaChange(
                                    event.target.value
                                )
                            }
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                            required
                        >
                            <option value="">
                                Selecteer een agenda
                            </option>

                            {agendas.map((agenda) => (
                                <option
                                    key={agenda.id}
                                    value={agenda.id}
                                >
                                    {agenda.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Agenda item */}
                    <div>
                        <label
                            htmlFor="agenda-item"
                            className="block text-sm font-medium text-foreground"
                        >
                            Agenda item
                        </label>

                        <select
                            id="agenda-item"
                            value={agendaItemId}
                            onChange={(event) =>
                                setAgendaItemId(
                                    event.target.value
                                )
                            }
                            disabled={!agendaId}
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="">
                                {!agendaId
                                    ? "Selecteer eerst een agenda"
                                    : filteredAgendaItems.length === 0
                                      ? "Geen agenda items"
                                      : "Selecteer een agenda item"}
                            </option>

                            {filteredAgendaItems.map(
                                (agendaItem) => (
                                    <option
                                        key={agendaItem.id}
                                        value={agendaItem.id}
                                    >
                                        {agendaItem.name}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {/* Task */}
            <div className="rounded-2xl border border-border bg-surface p-6">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        Taak
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Vul de gegevens van de taak in.
                    </p>
                </div>

                <div className="mt-6 space-y-6">
                    {/* Name */}
                    <div>
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
                            placeholder="Bijvoorbeeld: Presentatie voorbereiden"
                            required
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-foreground"
                        >
                            Beschrijving
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows={4}
                            placeholder="Optionele beschrijving..."
                            className="mt-2 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    {/* Deadline */}
                    <div className="max-w-sm">
                        <label
                            htmlFor="deadline-date"
                            className="block text-sm font-medium text-foreground"
                        >
                            Deadline
                        </label>

                        <input
                            id="deadline-date"
                            type="date"
                            value={deadlineDate}
                            onChange={(event) =>
                                setDeadlineDate(
                                    event.target.value
                                )
                            }
                            required
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                >
                    {error}
                </div>
            )}

            {/* Submit */}
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