import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    deleteApiAgendasId,
    getApiAgendasId,
    getApiAgendaItems,
} from "@/generated/api";

import EditButton from "@/app/components/EditButton";
import DeleteButton from "@/app/components/DeleteButton";
import AgendaItemList from "@/app/components/AgendaItemList";

type AgendaPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AgendaPage({
    params,
}: AgendaPageProps) {
    const { id } = await params;

    const [agendaResponse, agendaItemsResponse] =
        await Promise.all([
            getApiAgendasId(id),
            getApiAgendaItems(),
        ]);

    if (agendaResponse.status !== 200) {
        notFound();
    }

    if (agendaItemsResponse.status !== 200) {
        throw new Error(
            "De agenda items konden niet worden opgehaald."
        );
    }

    const agenda = agendaResponse.data;

    const agendaItems = agendaItemsResponse.data.filter(
        (agendaItem) => agendaItem.agendaId === id
    );

    const hasAgendaItems = agendaItems.length > 0;

    const deleteTitle = hasAgendaItems
        ? "Agenda en agenda items verwijderen?"
        : "Agenda verwijderen?";

    const deleteDescription = hasAgendaItems
        ? `Deze agenda heeft ${agendaItems.length} ${
              agendaItems.length === 1
                  ? "agenda item"
                  : "agenda items"
          }. Als je deze agenda verwijdert, worden ook alle gekoppelde agenda items verwijderd. Deze actie kan niet ongedaan worden.`
        : "Weet je zeker dat je deze agenda wilt verwijderen? Deze actie kan niet ongedaan worden.";

    async function deleteAgenda() {
        "use server";

        const response = await deleteApiAgendasId(id);

        if (response.status !== 204) {
            throw new Error(
                "De agenda kon niet worden verwijderd."
            );
        }

        revalidatePath("/agendas");
        revalidatePath("/agenda-items");

        redirect("/agendas");
    }

    return (
        <main className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">

                {/* Back navigation */}
                <Link
                    href="/agendas"
                    className="inline-flex min-h-10 items-center text-sm font-medium text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                >
                    ← Alle agenda&apos;s
                </Link>

                {/* Resource header */}
                <section className="mt-10">
                    <div className="flex max-w-5xl items-start justify-between gap-8">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-accent">
                                Agenda
                            </p>

                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                {agenda.name}
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                                {agenda.description ||
                                    "Deze agenda heeft nog geen beschrijving."}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-3">
                            <EditButton
                                href={`/agendas/${id}/edit`}
                            />

                            <DeleteButton
                                onDelete={deleteAgenda}
                                title={deleteTitle}
                                description={deleteDescription}
                            />
                        </div>
                    </div>
                </section>

                {/* Agenda items */}
                <section className="mt-16">
                    <div className="mb-5 flex items-end justify-between gap-6">
                        <div>
                            <p className="text-sm font-medium text-muted">
                                Planning
                            </p>

                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                                Agenda items
                            </h2>

                            <p className="mt-2 text-sm text-muted">
                                Items die aan deze agenda zijn gekoppeld.
                            </p>
                        </div>

                        <span className="shrink-0 text-sm text-muted">
                            {agendaItems.length}{" "}
                            {agendaItems.length === 1
                                ? "item"
                                : "items"}
                        </span>
                    </div>

                    <AgendaItemList
                        agendaItems={agendaItems}
                        showAgenda={false}
                    />
                </section>
            </div>
        </main>
    );
}