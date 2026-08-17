import Link from "next/link";

import type { getApiAgendaItems } from "@/generated/api";

type AgendaItem = Awaited<
    ReturnType<typeof getApiAgendaItems>
> extends infer Response
    ? Response extends { status: 200; data: infer Data }
    ? Data extends readonly (infer Item)[]
    ? Item
    : never
    : never
    : never;

type AgendaItemListProps = {
    agendaItems: AgendaItem[];
    showAgenda?: boolean;
};

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

export default function AgendaItemList({
    agendaItems,
    showAgenda = true,
}: AgendaItemListProps) {
    const sortedAgendaItems = [...agendaItems].sort((a, b) => {
        const dateA = a.startDate ?? "";
        const dateB = b.startDate ?? "";

        return dateA.localeCompare(dateB);
    });

    if (sortedAgendaItems.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                    Geen agenda items gevonden
                </h2>

                <p className="mt-2 text-sm text-muted">
                    Er zijn momenteel geen agenda items beschikbaar.
                </p>
            </div>
        );
    }

    return (
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

                            {showAgenda && (
                                <th className="px-6 py-4 font-medium">
                                    Agenda
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {sortedAgendaItems.map((agendaItem) => (
                            <tr
                                key={agendaItem.id}
                                className="border-b border-border last:border-b-0 transition-colors hover:bg-background"
                            >
                                <td className="px-6 py-5">
                                    <Link
                                        href={`/agenda-items/${agendaItem.id}`}
                                        className="font-medium text-foreground hover:underline"
                                    >
                                        {agendaItem.name ||
                                            "Naamloos agenda item"}
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

                                {showAgenda && (
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
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}