import { getApiAgendas } from "@/generated/api";

import AgendaCard from "@/app/components/Agenda/AgendaCard";
import CreateButton from "@/app/components/CreateButton";
import PageHeader from "@/app/components/PageHeader";

export default async function AgendasPage() {
  const response = await getApiAgendas();

  if (response.status !== 200) {
    throw new Error("De agenda's konden niet worden opgehaald.");
  }

  const agendas = [...response.data].sort((a, b) =>
    (a.name ?? "").localeCompare(a.name ?? "", "nl", {
      sensitivity: "base",
    }),
  );

  return (
    <main className="min-h-full">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-12">
        {/* Page header */}
        <section>
          <div className="flex items-end justify-between gap-6">
            <PageHeader
              eyebrow="Planning"
              title="Agenda's"
              description="Bekijk en beheer de agenda's binnen Agenda Management."
            />

            <CreateButton href="/agendas/new">
              Nieuwe agenda
            </CreateButton>
          </div>
        </section>

        {/* Overview */}
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Alle agenda&apos;s
              </h2>

              <p className="mt-1 text-sm text-muted">
                {agendas.length}{" "}
                {agendas.length === 1
                  ? "agenda"
                  : "agenda's"}{" "}
                beschikbaar
              </p>
            </div>
          </div>

          {agendas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
              <h2 className="text-lg font-semibold text-foreground">
                Nog geen agenda&apos;s
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                Maak je eerste agenda aan om te beginnen
                met plannen.
              </p>

              <div className="mt-6">
                <CreateButton href="/agendas/new">
                  Eerste agenda maken
                </CreateButton>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="divide-y divide-border">
                {agendas.map((agenda) => (
                  <AgendaCard
                    key={agenda.id}
                    agenda={agenda}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}