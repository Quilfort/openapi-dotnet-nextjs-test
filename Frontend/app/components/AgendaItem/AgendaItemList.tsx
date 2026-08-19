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

function formatDate(
    date?: string
): {
    day: string;
    month: string;
    year: string;
} {
    if (!date) {
        return {
            day: "—",
            month: "",
            year: "",
        };
    }

    const parsedDate = new Date(date);

    return {
        day: parsedDate.toLocaleDateString("nl-NL", {
            day: "numeric",
        }),
        month: parsedDate.toLocaleDateString("nl-NL", {
            month: "short",
        }),
        year: parsedDate.toLocaleDateString("nl-NL", {
            year: "numeric",
        }),
    };
}

function formatTimeRange(
    startTime?: string | null,
    endTime?: string | null
): string {
    if (!startTime && !endTime) {
        return "";
    }

    if (startTime && endTime) {
        return `${startTime.slice(0, 5)} – ${endTime.slice(0, 5)}`;
    }

    if (startTime) {
        return `Vanaf ${startTime.slice(0, 5)}`;
    }

    return `Tot ${endTime?.slice(0, 5)}`;
}

function formatDateRange(
    startDate?: string,
    endDate?: string | null
): string {
    if (!startDate) {
        return "Geen datum";
    }

    if (!endDate || startDate === endDate) {
        return "";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return `${start.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
    })} – ${end.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
    })}`;
}

export default function AgendaItemList({
    agendaItems,
    showAgenda = true,
}: AgendaItemListProps) {
    const sortedAgendaItems = [...agendaItems].sort((a, b) => {
        const dateA = a.startDate ?? "";
        const dateB = b.startDate ?? "";

        if (dateA !== dateB) {
            return dateA.localeCompare(dateB);
        }

        const timeA = a.startTime ?? "";
        const timeB = b.startTime ?? "";

        return timeA.localeCompare(timeB);
    });

    if (sortedAgendaItems.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                    Geen agenda items
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                    Er zijn momenteel geen agenda items beschikbaar.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="divide-y divide-border">
                {sortedAgendaItems.map((agendaItem) => {
                    const date = formatDate(agendaItem.startDate);
                    const time = formatTimeRange(
                        agendaItem.startTime,
                        agendaItem.endTime
                    );

                    const dateRange = formatDateRange(
                        agendaItem.startDate,
                        agendaItem.endDate
                    );

                    return (
                        <Link
                            key={agendaItem.id}
                            href={`/agenda-items/${agendaItem.id}`}
                            className="group block px-6 py-5 transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                        >
                            <div className="flex items-center gap-5">
                                {/* Date */}
                                <div className="w-16 shrink-0 text-center">
                                    <div className="text-2xl font-semibold tracking-tight text-foreground">
                                        {date.day}
                                    </div>

                                    <div className="text-xs font-medium uppercase tracking-wide text-accent">
                                        {date.month}
                                    </div>

                                    <div className="text-[11px] text-muted">
                                        {date.year}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-12 w-px bg-border" />

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <h3 className="truncate font-semibold text-foreground group-hover:text-accent">
                                            {agendaItem.name ||
                                                "Naamloos agenda item"}
                                        </h3>

                                        {dateRange && (
                                            <span className="text-xs text-muted">
                                                {dateRange}
                                            </span>
                                        )}
                                    </div>

                                    {agendaItem.description && (
                                        <p className="mt-1 line-clamp-1 text-sm text-muted">
                                            {agendaItem.description}
                                        </p>
                                    )}

                                    {showAgenda && (
                                        <div className="mt-2">
                                            {agendaItem.agenda ? (
                                                <span className="text-xs font-medium text-muted">
                                                    {agendaItem.agenda.name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted">
                                                    Onbekende agenda
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Time */}
                                <div className="hidden shrink-0 text-right sm:block">
                                    {time ? (
                                        <p className="text-sm font-medium text-foreground">
                                            {time}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-muted">
                                            Geen tijd
                                        </p>
                                    )}
                                </div>

                                {/* Arrow */}
                                <span
                                    aria-hidden="true"
                                    className="shrink-0 text-lg text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
                                >
                                    →
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}