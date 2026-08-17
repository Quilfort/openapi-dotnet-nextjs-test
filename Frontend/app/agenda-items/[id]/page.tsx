import Link from "next/link";
import { notFound } from "next/navigation";

import { getApiAgendaItemsId } from "@/generated/api";

function formatDateRange(
    startDate?: string,
    endDate?: string | null
): string {
    if (!startDate) {
        return "Geen datum";
    }

    const start = new Date(startDate);

    if (!endDate || startDate === endDate) {
        return start.toLocaleDateString("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    const end = new Date(endDate);

    return `${start.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })} – ${end.toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })}`;
}

function formatTimeRange(
    startTime?: string | null,
    endTime?: string | null
): string {
    if (!startTime && !endTime) {
        return "Geen tijd opgegeven";
    }

    if (startTime && endTime) {
        return `${startTime.slice(0, 5)} – ${endTime.slice(0, 5)}`;
    }

    if (startTime) {
        return `Vanaf ${startTime.slice(0, 5)}`;
    }

    return `Tot ${endTime?.slice(0, 5)}`;
}

type AgendaItemPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AgendaItemPage({
    params,
}: AgendaItemPageProps) {
    const { id } = await params;

    const response = await getApiAgendaItemsId(id);

    if (response.status !== 200) {
        notFound();
    }

    const agendaItem = response.data;

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
                        href="/agenda-items"
                        className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                        ← Agenda items
                    </Link>
                </header>

                {/* Content */}
                <section className="py-16">
                    <div className="mb-12 max-w-3xl">
                        <p className="mb-3 text-sm font-medium text-muted">
                            Agenda item
                        </p>

                        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                            {agendaItem.name}
                        </h1>

                        {agendaItem.description && (
                            <p className="mt-6 text-lg leading-8 text-muted">
                                {agendaItem.description}
                            </p>
                        )}
                    </div>

                    <div className="max-w-3xl overflow-hidden rounded-2xl border border-border bg-surface">
                        <dl className="divide-y divide-border">
                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Datum
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {formatDateRange(
                                        agendaItem.startDate,
                                        agendaItem.endDate
                                    )}
                                </dd>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Tijd
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {formatTimeRange(
                                        agendaItem.startTime,
                                        agendaItem.endTime
                                    )}
                                </dd>
                            </div>

                            <div className="grid gap-2 px-6 py-5 sm:grid-cols-3 sm:gap-6">
                                <dt className="text-sm font-medium text-muted">
                                    Agenda
                                </dt>

                                <dd className="text-sm text-foreground sm:col-span-2">
                                    {agendaItem.agenda ? (
                                        <Link
                                            href={`/agendas/${agendaItem.agenda.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {agendaItem.agenda.name}
                                        </Link>
                                    ) : (
                                        "Onbekende agenda"
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border py-6 text-sm text-muted">
                    Agenda items → OpenAPI → Generated client → Next.js
                </footer>
            </div>
        </main>
    );
}