import Link from "next/link";
import { redirect } from "next/navigation";

import {
    getApiAgendas,
    postApiAgendaItems,
} from "@/generated/api";

import AgendaItemForm from "@/app/components/AgendaItem/AgendaItemForm";

export default async function NewAgendaItemPage() {
    const response = await getApiAgendas();

    if (response.status !== 200) {
        throw new Error("De agenda's konden niet worden opgehaald.");
    }

    const agendas = [...response.data].sort((a, b) =>
        (a.name ?? "").localeCompare(
            b.name ?? "",
            "nl",
            {
                sensitivity: "base",
            }
        )
    );

    async function createAgendaItem(
        agendaItem: Parameters<
            typeof postApiAgendaItems
        >[0]
    ) {
        "use server";

        const response = await postApiAgendaItems(agendaItem);

        if (response.status !== 201) {
            console.error(
                "Agenda item creation failed:",
                response.data
            );

            throw new Error(
                "Het agenda item kon niet worden aangemaakt."
            );
        }

        redirect(`/agenda-items/${response.data.id}`);
    }

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
                    <div className="mb-10 max-w-3xl">
                        <p className="mb-3 text-sm font-medium text-muted">
                            Nieuw agenda item
                        </p>

                        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                            Agenda item aanmaken
                        </h1>

                        <p className="mt-4 text-lg leading-8 text-muted">
                            Maak een nieuw agenda item aan en koppel het
                            aan een agenda.
                        </p>
                    </div>

                    {agendas.length === 0 ? (
                        <div className="max-w-3xl rounded-2xl border border-dashed border-border bg-surface p-8">
                            <h2 className="text-lg font-semibold text-foreground">
                                Geen agenda's beschikbaar
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted">
                                Er moet minimaal één agenda bestaan voordat
                                je een agenda item kunt aanmaken.
                            </p>

                            <Link
                                href="/settings/agendas/new"
                                className="mt-6 inline-flex rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
                            >
                                Nieuwe agenda maken
                            </Link>
                        </div>
                    ) : (
                        <AgendaItemForm
                            agendas={agendas}
                            onSubmit={createAgendaItem}
                            submitLabel="Agenda item aanmaken"
                        />
                    )}
                </section>
            </div>
        </main>
    );
}