import Link from "next/link";
import { getApiAgendaItems } from "@/generated/api";

function formatDateLabel(date: string): string {
    const today = new Date();
    const itemDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    itemDate.setHours(0, 0, 0, 0);

    const difference =
        (itemDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (difference === 0) return "Vandaag";
    if (difference === 1) return "Morgen";

    return itemDate.toLocaleDateString("nl-NL", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

function formatTimeRange(
    startTime?: string | null,
    endTime?: string | null
): string {
    if (!startTime && !endTime) return "Geen tijd";
    if (startTime && endTime) return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
    if (startTime) return `Vanaf ${startTime.slice(0, 5)}`;
    return `Tot ${endTime?.slice(0, 5)}`;
}

function isToday(date?: string): boolean {
    if (!date) return false;
    const today = new Date();
    const itemDate = new Date(date);
    return (
        today.getFullYear() === itemDate.getFullYear() &&
        today.getMonth() === itemDate.getMonth() &&
        today.getDate() === itemDate.getDate()
    );
}

function getDynamicGreeting(): string {
    const hours = new Date().getHours();
    if (hours < 12) return "Goedemorgen";
    if (hours < 18) return "Goedemiddag";
    return "Goedenavond";
}

export default async function Home() {
    const response = await getApiAgendaItems();

    if (response.status !== 200) {
        throw new Error("De agenda items konden niet worden opgehaald.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcomingItems = [...response.data]
        .filter((agendaItem) => {
            if (!agendaItem.startDate) return false;
            const startDate = new Date(agendaItem.startDate);
            startDate.setHours(0, 0, 0, 0);
            return startDate >= today && startDate < sevenDaysFromNow;
        })
        .sort((a, b) => {
            const dateA = a.startDate ?? "";
            const dateB = b.startDate ?? "";
            if (dateA !== dateB) return dateA.localeCompare(dateB);
            return (a.startTime ?? "").localeCompare(b.startTime ?? "");
        });

    const todayCount = upcomingItems.filter((item) =>
        isToday(item.startDate)
    ).length;

    const agendaCount = new Set(
        upcomingItems.map((item) => item.agendaId).filter(Boolean)
    ).size;

    const groupedItems = upcomingItems.reduce<
        Record<string, typeof upcomingItems>
    >((groups, item) => {
        if (!item.startDate) return groups;
        if (!groups[item.startDate]) groups[item.startDate] = [];
        groups[item.startDate].push(item);
        return groups;
    }, {});

    const groupedEntries = Object.entries(groupedItems);
    const greeting = getDynamicGreeting();

    return (
        <main className="min-h-screen pb-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">

                {/* Header Widget */}
                <header className="mb-8 rounded-2xl border border-border bg-surface/50 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-accent">
                                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                                Live Dashboard
                            </div>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                {greeting}.
                            </h1>
                            <p className="mt-1 text-sm text-muted">
                                Hier is je overzicht voor de komende 7 dagen.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href="/agenda-items/new"
                                className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
                            >
                                + Nieuw item
                            </Link>
                            <Link
                                href="/agenda-items"
                                className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface active:scale-95"
                            >
                                Volledige planning
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Dashboard Metrics Grid */}
                <section aria-label="Statistieken" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted">
                            Komende 7 dagen
                        </p>
                        <div className="mt-3 flex items-baseline justify-between">
                            <span className="text-3xl font-bold tracking-tight text-foreground">
                                {upcomingItems.length}
                            </span>
                            <span className="text-xs text-muted">afspraken</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted">
                            Vandaag
                        </p>
                        <div className="mt-3 flex items-baseline justify-between">
                            <span className="text-3xl font-bold tracking-tight text-foreground">
                                {todayCount}
                            </span>
                            <span className="text-xs text-muted">gepland</span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur-sm">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted">
                            Actieve Agenda&apos;s
                        </p>
                        <div className="mt-3 flex items-baseline justify-between">
                            <span className="text-3xl font-bold tracking-tight text-foreground">
                                {agendaCount}
                            </span>
                            <span className="text-xs text-muted">bronnen</span>
                        </div>
                    </div>
                </section>

                {/* Timeline Schedule Main Section */}
                <section className="rounded-2xl border border-border bg-surface/30 p-6 sm:p-8 backdrop-blur-sm">
                    <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            Aankomende Agenda
                        </h2>
                        <span className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted">
                            7 dagen view
                        </span>
                    </div>

                    {groupedEntries.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border py-12 text-center">
                            <h3 className="text-base font-semibold text-foreground">
                                Je agenda is leeg
                            </h3>
                            <p className="mt-1 text-sm text-muted">
                                Er staan de komende week geen afspraken gepland.
                            </p>
                            <Link
                                href="/agenda-items/new"
                                className="mt-4 inline-flex text-sm font-medium text-accent hover:underline"
                            >
                                Direct item toevoegen →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {groupedEntries.map(([date, items]) => (
                                <div key={date} className="space-y-3">
                                    {/* Date Header Tag */}
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                                            {formatDateLabel(date)}
                                        </span>
                                        <span className="h-px flex-1 bg-border" />
                                    </div>

                                    {/* Agenda Items List */}
                                    <div className="grid gap-2">
                                        {items.map((agendaItem) => (
                                            <Link
                                                key={agendaItem.id}
                                                href={`/agenda-items/${agendaItem.id}`}
                                                className="group flex flex-col justify-between gap-3 rounded-xl border border-border/60 bg-surface/60 p-4 transition-all hover:border-border hover:bg-surface hover:shadow-sm sm:flex-row sm:items-center"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="rounded-lg border border-border bg-surface/80 px-2.5 py-1 text-xs font-semibold tabular-nums text-foreground">
                                                        {formatTimeRange(
                                                            agendaItem.startTime,
                                                            agendaItem.endTime
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-accent">
                                                            {agendaItem.name || "Naamloos agenda item"}
                                                        </h3>
                                                        {agendaItem.description && (
                                                            <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                                                                {agendaItem.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between sm:justify-end gap-2">
                                                    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                                                        {agendaItem.agenda?.name ?? "Onbekend"}
                                                    </span>
                                                    <span className="text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100">
                                                        →
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}