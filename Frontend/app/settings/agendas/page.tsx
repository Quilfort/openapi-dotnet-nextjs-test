import Link from "next/link";

import { getApiAgendas } from "@/generated/api";

import CreateButton from "@/app/components/CreateButton";
import PageHeader from "@/app/components/PageHeader";

export default async function SettingsAgendasPage() {
    const response = await getApiAgendas();

    if (response.status !== 200) {
        throw new Error(
            "Agenda's konden niet worden opgehaald."
        );
    }

    const agendas = [...response.data];

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
                {/* Header */}
                <section>
                    <div className="flex items-end justify-between gap-6">
                        <PageHeader
                            eyebrow="Instellingen"
                            title="Agenda's"
                            description="Beheer de agenda's die binnen de organisatie gebruikt worden."
                        />

                        <CreateButton href="/settings/agendas/new">
                            Nieuwe agenda
                        </CreateButton>
                    </div>
                </section>

                {/* Explanation */}
                <section className="mt-8">
                    <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
                        <p className="text-sm font-medium text-foreground">
                            Beheer van agenda's
                        </p>

                        <p className="mt-1 text-sm leading-6 text-muted">
                            Agenda's zijn overkoepelende onderdelen
                            van de planning. Agenda items kunnen later
                            aan een agenda worden gekoppeld en daarop
                            worden gefilterd.
                        </p>
                    </div>
                </section>

                {/* Agenda list */}
                <section className="mt-10">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">
                                Beschikbare agenda's
                            </h2>

                            <p className="mt-1 text-sm text-muted">
                                {agendas.length}{" "}
                                {agendas.length === 1
                                    ? "agenda"
                                    : "agenda's"}
                            </p>
                        </div>
                    </div>

                    {agendas.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
                            <h2 className="text-lg font-semibold text-foreground">
                                Nog geen agenda's
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                                Maak de eerste agenda aan om deze
                                beschikbaar te maken binnen de planning.
                            </p>

                            <div className="mt-5">
                                <CreateButton href="/settings/agendas/new">
                                    Nieuwe agenda
                                </CreateButton>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-border bg-surface">
                            <div className="divide-y divide-border">
                                {agendas.map((agenda) => (
                                    <Link
                                        key={agenda.id}
                                        href={`/settings/agendas/${agenda.id}`}
                                        className="group block px-5 py-4 transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-semibold text-accent">
                                                {agenda.name
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                    "A"}
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-accent sm:text-base">
                                                    {agenda.name ||
                                                        "Naamloze agenda"}
                                                </h3>

                                                {agenda.description && (
                                                    <p className="mt-0.5 truncate text-sm text-muted">
                                                        {
                                                            agenda.description
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <span
                                                aria-hidden="true"
                                                className="shrink-0 text-base text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
                                            >
                                                →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}