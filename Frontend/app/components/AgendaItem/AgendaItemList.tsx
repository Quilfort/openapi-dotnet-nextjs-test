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
    if (!startDate || !endDate || startDate === endDate) {
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
    const sortedAgendaItems = [...agendaItems].sort(
        (a, b) => {
            const dateA = a.startDate ?? "";
            const dateB = b.startDate ?? "";

            if (dateA !== dateB) {
                return dateA.localeCompare(dateB);
            }

            const timeA = a.startTime ?? "";
            const timeB = b.startTime ?? "";

            return timeA.localeCompare(timeB);
        }
    );

    if (sortedAgendaItems.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                    Geen agenda items
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                    Er zijn geen agenda items die aan deze selectie voldoen.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="divide-y divide-border">
                {sortedAgendaItems.map((agendaItem) => {
                    const date = formatDate(
                        agendaItem.startDate
                    );

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
                            className="group block px-5 py-4 transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                        >
                            <div className="flex items-center gap-4">
                                {/* Date */}
                                <div className="w-14 shrink-0 text-center">
                                    <div className="text-xl font-semibold tracking-tight text-foreground">
                                        {date.day}
                                    </div>

                                    <div className="text-[11px] font-medium uppercase tracking-wide text-accent">
                                        {date.month}
                                    </div>

                                    <div className="text-[10px] text-muted">
                                        {date.year}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-10 w-px bg-border" />

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                                        <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-accent sm:text-base">
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
                                        <p className="mt-0.5 line-clamp-1 text-xs text-muted sm:text-sm">
                                            {agendaItem.description}
                                        </p>
                                    )}

                                    {showAgenda &&
                                        agendaItem.agenda && (
                                            <p className="mt-1 text-xs font-medium text-muted">
                                                {agendaItem.agenda.name}
                                            </p>
                                        )}
                                </div>

                                {/* Time */}
                                <div className="hidden shrink-0 text-right sm:block">
                                    {time ? (
                                        <p className="text-xs font-medium text-foreground">
                                            {time}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-muted">
                                            Geen tijd
                                        </p>
                                    )}
                                </div>

                                {/* Arrow */}
                                <span
                                    aria-hidden="true"
                                    className="shrink-0 text-base text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
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