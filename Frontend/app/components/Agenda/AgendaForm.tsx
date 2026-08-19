"use client";

import { useState } from "react";
import type { Agenda } from "@/generated/models";

type AgendaFormProps = {
  initialData?: Agenda;
  onSubmit: (agenda: Agenda) => Promise<void>;
};

export default function AgendaForm({
  initialData,
  onSubmit,
}: AgendaFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Naam is verplicht.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...initialData,
        name: trimmedName,
        description: description.trim() || null,
      });
    } catch {
      setError("Er ging iets mis bij het opslaan van de agenda.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-8"
    >
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
          required
          aria-invalid={error ? "true" : "false"}
          className="mt-2 block w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
          placeholder="Naam van de agenda"
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
          rows={5}
          className="mt-2 block w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-800"
          placeholder="Beschrijving van de agenda"
        />
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Opslaan..." : "Opslaan"}
        </button>
      </div>
    </form>
  );
}