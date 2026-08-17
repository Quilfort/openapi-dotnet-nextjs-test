import Link from "next/link";

import { getApiAgendaItems } from "@/generated/api";

import CreateButton from "@/app/components/CreateButton";
import AgendaItemList from "@/app/components/AgendaItemList";

export default async function AgendaItemsPage() {
    const response = await getApiAgendaItems();

    if (response.status !== 200) {
        throw new Error(
            "Agenda items konden niet worden opgehaald."
        );
    }

    const agendaItems = [...response.data];

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
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

                <section className="py-16">
                    <div className="mb-10 flex items-end justify-between gap-6">
                        <div>
                            <p className="mb-3 text-sm font-medium text-muted">
                                Planning
                            </p>

                            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                Kalender
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                                Een overzicht van alle items uit de
                                verschillende agenda&apos;s, gesorteerd op
                                datum.
                            </p>
                        </div>

                        <CreateButton href="/agenda-items/new">
                            Nieuw agenda item
                        </CreateButton>
                    </div>

                    <AgendaItemList
                        agendaItems={agendaItems}
                    />
                </section>
            </div>
        </main>
    );
}