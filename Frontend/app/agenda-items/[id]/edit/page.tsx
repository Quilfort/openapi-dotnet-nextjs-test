import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
    getApiAgendaItemsId,
    getApiAgendas,
    putApiAgendaItemsId,
} from "@/generated/api";

import AgendaItemForm from "@/app/components/AgendaItem/AgendaItemForm";

type AgendaItemEditPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AgendaItemEditPage({
    params,
}: AgendaItemEditPageProps) {
    const { id } = await params;

    const [agendaItemResponse, agendasResponse] =
        await Promise.all([
            getApiAgendaItemsId(id),
            getApiAgendas(),
        ]);

    if (agendaItemResponse.status !== 200) {
        notFound();
    }

    if (agendasResponse.status !== 200) {
        throw new Error(
            "De agenda's konden niet worden opgehaald."
        );
    }

    const agendaItem = agendaItemResponse.data;

    const agendas = [...agendasResponse.data].sort(
        (a, b) =>
            (a.name ?? "").localeCompare(
                b.name ?? "",
                "nl",
                {
                    sensitivity: "base",
                }
            )
    );

    async function updateAgendaItem(
        updatedAgendaItem: Parameters<
            typeof putApiAgendaItemsId
        >[1]
    ) {
        "use server";

        const response = await putApiAgendaItemsId(
            id,
            updatedAgendaItem
        );

        if (response.status !== 204) {
            throw new Error(
                "Het agenda item kon niet worden bijgewerkt."
            );
        }

        redirect(`/agenda-items/${id}`);
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
                        href={`/agenda-items/${id}`}
                        className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                    >
                        ← Agenda item
                    </Link>
                </header>

                {/* Content */}
                <section className="py-16">
                    <div className="mb-10 max-w-3xl">
                        <p className="mb-3 text-sm font-medium text-muted">
                            Agenda item bewerken
                        </p>

                        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                            {agendaItem.name}
                        </h1>

                        <p className="mt-4 text-lg leading-8 text-muted">
                            Pas de gegevens van dit agenda item
                            aan.
                        </p>
                    </div>

                    <AgendaItemForm
                        agendas={agendas}
                        initialData={agendaItem}
                        onSubmit={updateAgendaItem}
                        submitLabel="Wijzigingen opslaan"
                    />
                </section>
            </div>
        </main>
    );
}