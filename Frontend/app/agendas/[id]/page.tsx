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
    ? `Deze agenda heeft ${agendaItems.length} ${agendaItems.length === 1
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
            href="/agendas"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            ← Alle agenda&apos;s
          </Link>
        </header>

        {/* Content */}
        <section className="py-16">
          {/* Agenda header */}
          <div className="flex max-w-4xl items-start justify-between gap-8">
            <div>
              <p className="mb-3 text-sm font-medium text-muted">
                Agenda
              </p>

              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {agenda.name}
              </h1>
            </div>

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

          {/* Description */}
          <div className="mt-12 max-w-3xl border-t border-border pt-8">
            <h2 className="text-sm font-medium text-muted">
              Beschrijving
            </h2>

            {agenda.description ? (
              <p className="mt-3 text-lg leading-8 text-foreground">
                {agenda.description}
              </p>
            ) : (
              <p className="mt-3 text-lg leading-8 text-muted">
                Deze agenda heeft nog geen beschrijving.
              </p>
            )}
          </div>

          {/* Agenda items */}
          <div className="mt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Agenda items
              </h2>

              <p className="mt-2 text-sm text-muted">
                De items die aan deze agenda zijn gekoppeld.
              </p>
            </div>

            <AgendaItemList
              agendaItems={agendaItems}
              showAgenda={false}
            />
          </div>
        </section>
      </div>
    </main>
  );
}