import Link from "next/link";

import { getApiAgendaItems } from "@/generated/api";

function formatDateRange(
    startDate?: string,
    endDate?: string | null
): string {
    if (!startDate) {
        return "Geen datum";
    }

    if (!endDate || startDate === endDate) {
        return new Date(startDate).toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return `${start.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })} – ${end.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })}`;
}

function formatTimeRange(
    startTime?: string | null,
    endTime?: string | null
): string {
    if (!startTime && !endTime) {
        return "—";
    }

    if (startTime && endTime) {
        return `${startTime.slice(0, 5)} – ${endTime.slice(0, 5)}`;
    }

    if (startTime) {
        return `Vanaf ${startTime.slice(0, 5)}`;
    }

    return `Tot ${endTime?.slice(0, 5)}`;
}

export default async function AgendaItemsPage() {
    const response = await getApiAgendaItems();

    if (response.status !== 200) {
        throw new Error("Agenda items konden niet worden opgehaald.");
    }

    const agendaItems = [...response.data].sort((a, b) => {
        const dateA = a.startDate ?? "";
        const dateB = b.startDate ?? "";

        return dateA.localeCompare(dateB);
    });

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-border pb-6">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
                    >
                        Agenda Management
                    </Link>

                    <Link
                        href="/agendas"
                        className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                        ← Agendas
                    </Link>
                </header>

                {/* Page header */}
                <section className="py-16">
                    <div className="mb-10 flex items-end justify-between gap-6">
                        <div>
                            <p className="mb-3 text-sm font-medium text-muted">
                                Planning
                            </p>

                            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                Agenda items
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                                Een overzicht van alle items uit de verschillende agenda&apos;s,
                                gesorteerd op datum.
                            </p>
                        </div>
                    </div>

                    {agendaItems.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                            <h2 className="text-lg font-semibold text-foreground">
                                Geen agenda items gevonden
                            </h2>

                            <p className="mt-2 text-sm text-muted">
                                Er zijn momenteel geen agenda items beschikbaar.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-border text-sm text-muted">
                                            <th className="px-6 py-4 font-medium">
                                                Naam
                                            </th>

                                            <th className="px-6 py-4 font-medium">
                                                Beschrijving
                                            </th>

                                            <th className="px-6 py-4 font-medium">
                                                Datum
                                            </th>

                                            <th className="px-6 py-4 font-medium">
                                                Tijd
                                            </th>

                                            <th className="px-6 py-4 font-medium">
                                                Agenda
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {agendaItems.map((agendaItem) => (
                                            <tr
                                                key={agendaItem.id}
                                                className="border-b border-border last:border-b-0 transition-colors hover:bg-background"
                                            >
                                                <td className="px-6 py-5">
                                                    <Link
                                                        href={`/agenda-items/${agendaItem.id}`}
                                                        className="font-medium text-foreground hover:underline"
                                                    >
                                                        {agendaItem.name || "Naamloos agenda item"}
                                                    </Link>
                                                </td>

                                                <td className="max-w-xs px-6 py-5">
                                                    <span className="line-clamp-2 text-sm text-muted">
                                                        {agendaItem.description || "—"}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5 text-sm text-foreground">
                                                    {formatDateRange(
                                                        agendaItem.startDate,
                                                        agendaItem.endDate
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-5 text-sm text-muted">
                                                    {formatTimeRange(
                                                        agendaItem.startTime,
                                                        agendaItem.endTime
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {agendaItem.agenda ? (
                                                        <span className="text-sm font-medium text-foreground">
                                                            {agendaItem.agenda.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-muted">
                                                            Onbekende agenda
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>

                {/* Footer */}
                <footer className="border-t border-border py-6 text-sm text-muted">
                    Agenda items → OpenAPI → Generated client → Next.js
                </footer>
            </div>
        </main>
    );
}