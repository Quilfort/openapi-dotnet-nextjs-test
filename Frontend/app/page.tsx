import Link from "next/link";

import { getApiAgendaItems } from "@/generated/api";

function formatDateLabel(date: string): string {
    const today = new Date();
    const itemDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    itemDate.setHours(0, 0, 0, 0);

    const difference =
        (itemDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24);

    if (difference === 0) {
        return "Vandaag";
    }

    if (difference === 1) {
        return "Morgen";
    }

    return itemDate.toLocaleDateString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
}

function formatTimeRange(
    startTime?: string | null,
    endTime?: string | null
): string {
    if (!startTime && !endTime) {
        return "Geen tijd";
    }

    if (startTime && endTime) {
        return `${startTime.slice(0, 5)} – ${endTime.slice(0, 5)}`;
    }

    if (startTime) {
        return `Vanaf ${startTime.slice(0, 5)}`;
    }

    return `Tot ${endTime?.slice(0, 5)}`;
}

function isToday(date?: string): boolean {
    if (!date) {
        return false;
    }

    const today = new Date();
    const itemDate = new Date(date);

    return (
        today.getFullYear() === itemDate.getFullYear() &&
        today.getMonth() === itemDate.getMonth() &&
        today.getDate() === itemDate.getDate()
    );
}

export default async function Home() {
    const response = await getApiAgendaItems();

    if (response.status !== 200) {
        throw new Error(
            "De agenda items konden niet worden opgehaald."
        );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(
        sevenDaysFromNow.getDate() + 7
    );

    const upcomingItems = [...response.data]
        .filter((agendaItem) => {
            if (!agendaItem.startDate) {
                return false;
            }

            const startDate = new Date(
                agendaItem.startDate
            );

            startDate.setHours(0, 0, 0, 0);

            return (
                startDate >= today &&
                startDate < sevenDaysFromNow
            );
        })
        .sort((a, b) => {
            const dateA = a.startDate ?? "";
            const dateB = b.startDate ?? "";

            if (dateA !== dateB) {
                return dateA.localeCompare(dateB);
            }

            return (a.startTime ?? "").localeCompare(
                b.startTime ?? ""
            );
        });

    const todayCount = upcomingItems.filter((item) =>
        isToday(item.startDate)
    ).length;

    const agendaCount = new Set(
        upcomingItems
            .map((item) => item.agendaId)
            .filter(Boolean)
    ).size;

    /*
     * Group items by date.
     *
     * This gives us:
     *
     * Vandaag
     *   item
     *   item
     *
     * Morgen
     *   item
     *
     * Donderdag 20 augustus
     *   item
     */
    const groupedItems = upcomingItems.reduce<
        Record<string, typeof upcomingItems>
    >((groups, item) => {
        if (!item.startDate) {
            return groups;
        }

        if (!groups[item.startDate]) {
            groups[item.startDate] = [];
        }

        groups[item.startDate].push(item);

        return groups;
    }, {});

    const groupedEntries = Object.entries(
        groupedItems
    );

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
                {/* Dashboard header */}
                <section className="border-b border-border pb-10">
                    <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-medium text-accent">
                                Agenda Management
                            </p>

                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                Goedemorgen.
                            </h1>

                            <p className="mt-4 max-w-xl text-base leading-7 text-muted">
                                Dit staat er de komende 7 dagen
                                op je planning.
                            </p>
                        </div>

                        <Link
                            href="/agenda-items"
                            className="shrink-0 text-sm font-medium text-foreground transition-colors hover:text-accent"
                        >
                            Volledige planning
                            <span className="ml-2 text-muted">
                                →
                            </span>
                        </Link>
                    </div>
                </section>

                {/* Overview */}
                <section
                    aria-label="Planning overzicht"
                    className="border-b border-border"
                >
                    <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-3">
                        <div className="py-7 pr-6">
                            <p className="text-sm text-muted">
                                Komende items
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                                {upcomingItems.length}
                            </p>
                        </div>

                        <div className="py-7 pl-6 sm:px-6">
                            <p className="text-sm text-muted">
                                Agenda&apos;s
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                                {agendaCount}
                            </p>
                        </div>

                        <div className="col-span-2 border-t border-border py-7 sm:col-span-1 sm:border-t-0 sm:pl-6">
                            <p className="text-sm text-muted">
                                Vandaag
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                                {todayCount}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Upcoming schedule */}
                <section className="pt-12">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                                Planning
                            </p>

                            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                                Aankomend
                            </h2>
                        </div>

                        {upcomingItems.length > 0 && (
                            <span className="text-sm text-muted">
                                Volgende 7 dagen
                            </span>
                        )}
                    </div>

                    {groupedEntries.length === 0 ? (
                        <div className="border-y border-border py-14">
                            <h3 className="text-lg font-semibold text-foreground">
                                Je agenda is leeg
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                                Er staan de komende 7 dagen
                                geen agenda items gepland.
                            </p>

                            <Link
                                href="/agenda-items/new"
                                className="mt-6 inline-flex text-sm font-medium text-accent hover:underline"
                            >
                                Agenda item toevoegen →
                            </Link>
                        </div>
                    ) : (
                        <div>
                            {groupedEntries.map(
                                ([date, items]) => (
                                    <div
                                        key={date}
                                        className="border-t border-border last:border-b"
                                    >
                                        {/* Date heading */}
                                        <div className="grid grid-cols-[120px_1fr] gap-6 py-4">
                                            <div className="text-sm font-medium capitalize text-foreground">
                                                {formatDateLabel(
                                                    date
                                                )}
                                            </div>

                                            <div className="text-xs uppercase tracking-wider text-muted">
                                                {items.length}{" "}
                                                {items.length ===
                                                1
                                                    ? "item"
                                                    : "items"}
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="divide-y divide-border border-t border-border">
                                            {items.map(
                                                (
                                                    agendaItem
                                                ) => (
                                                    <Link
                                                        key={
                                                            agendaItem.id
                                                        }
                                                        href={`/agenda-items/${agendaItem.id}`}
                                                        className="group grid grid-cols-[120px_1fr_auto] gap-6 py-5 transition-colors hover:bg-surface"
                                                    >
                                                        {/* Time */}
                                                        <div className="text-sm font-medium tabular-nums text-foreground">
                                                            {formatTimeRange(
                                                                agendaItem.startTime,
                                                                agendaItem.endTime
                                                            )}
                                                        </div>

                                                        {/* Main content */}
                                                        <div className="min-w-0">
                                                            <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-accent">
                                                                {agendaItem.name ||
                                                                    "Naamloos agenda item"}
                                                            </h3>

                                                            {agendaItem.description && (
                                                                <p className="mt-1 line-clamp-1 text-sm text-muted">
                                                                    {
                                                                        agendaItem.description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Agenda */}
                                                        <div className="hidden max-w-40 truncate text-right text-sm text-muted sm:block">
                                                            {agendaItem
                                                                .agenda
                                                                ?.name ??
                                                                "Onbekende agenda"}
                                                        </div>
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}