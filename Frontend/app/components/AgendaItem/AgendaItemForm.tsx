"use client";

import { FormEvent, useState } from "react";

import type { Agenda, AgendaItem } from "@/generated/models";

type AgendaItemFormProps = {
    agendas: Agenda[];
    initialData?: AgendaItem;
    onSubmit: (agendaItem: AgendaItem) => Promise<void>;
    submitLabel?: string;
};

export default function AgendaItemForm({
    agendas,
    initialData,
    onSubmit,
    submitLabel = "Agenda item aanmaken",
}: AgendaItemFormProps) {
    const [name, setName] = useState(initialData?.name ?? "");
    const [description, setDescription] = useState(
        initialData?.description ?? ""
    );
    const [startDate, setStartDate] = useState(
        initialData?.startDate ?? ""
    );
    const [endDate, setEndDate] = useState(
        initialData?.endDate ?? ""
    );
    const [startTime, setStartTime] = useState(
        initialData?.startTime ?? ""
    );
    const [endTime, setEndTime] = useState(
        initialData?.endTime ?? ""
    );
    const [agendaId, setAgendaId] = useState(
        initialData?.agendaId ?? ""
    );

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);

        if (!name.trim()) {
            setError("Naam is verplicht.");
            return;
        }

        if (!startDate) {
            setError("Startdatum is verplicht.");
            return;
        }

        if (!agendaId) {
            setError("Agenda is verplicht.");
            return;
        }

        const now = new Date();

        const selectedStart = startTime
            ? new Date(`${startDate}T${startTime}`)
            : new Date(`${startDate}T00:00`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(`${startDate}T00:00`);

        if (selectedDate < today) {
            setError("De startdatum mag niet in het verleden liggen.");
            return;
        }

        if (selectedStart < now) {
            setError(
                "De startdatum en starttijd mogen niet in het verleden liggen."
            );
            return;
        }

        if (endDate && endDate < startDate) {
            setError(
                "De einddatum mag niet vóór de startdatum liggen."
            );
            return;
        }

        if (endDate && startTime && endTime && endDate === startDate) {
            if (endTime < startTime) {
                setError(
                    "De eindtijd mag niet vóór de starttijd liggen."
                );
                return;
            }
        }

        const agendaItem: AgendaItem = {
            ...(initialData?.id
                ? {
                    id: initialData.id,
                }
                : {}),
            name: name.trim(),
            description: description.trim() || null,
            startDate,
            endDate: endDate || null,
            startTime: startTime || null,
            endTime: endTime || null,
            agendaId,
        };

        try {
            setIsSubmitting(true);

            await onSubmit(agendaItem);
        } catch {
            setError(
                "Er is iets misgegaan bij het opslaan van het agenda item."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-8"
        >
            {/* Error */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

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
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Bijvoorbeeld: Teamoverleg"
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
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Optionele beschrijving"
                    rows={4}
                    className="mt-2 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
            </div>

            {/* Agenda */}
            <div>
                <label
                    htmlFor="agendaId"
                    className="block text-sm font-medium text-foreground"
                >
                    Agenda
                </label>

                <select
                    id="agendaId"
                    name="agendaId"
                    value={agendaId}
                    onChange={(event) => setAgendaId(event.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                    <option value="">Selecteer een agenda</option>

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

            {/* Date */}
            <div>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        Datum
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Een startdatum is verplicht. Een einddatum is optioneel.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-foreground"
                        >
                            Startdatum
                        </label>

                        <input
                            id="startDate"
                            name="startDate"
                            type="date"
                            value={startDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(event) =>
                                setStartDate(event.target.value)
                            }
                            required
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="endDate"
                            className="block text-sm font-medium text-foreground"
                        >
                            Einddatum
                        </label>

                        <input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={endDate}
                            min={
                                startDate ||
                                new Date().toISOString().split("T")[0]
                            }
                            onChange={(event) =>
                                setEndDate(event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                </div>
            </div>

            {/* Time */}
            <div>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        Tijd
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        Tijd is optioneel.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="startTime"
                            className="block text-sm font-medium text-foreground"
                        >
                            Starttijd
                        </label>

                        <input
                            id="startTime"
                            name="startTime"
                            type="time"
                            value={startTime}
                            onChange={(event) =>
                                setStartTime(event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="endTime"
                            className="block text-sm font-medium text-foreground"
                        >
                            Eindtijd
                        </label>

                        <input
                            id="endTime"
                            name="endTime"
                            type="time"
                            value={endTime}
                            onChange={(event) =>
                                setEndTime(event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="border-t border-border pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? "Opslaan..." : submitLabel}
                </button>
            </div>
        </form>
    );
}