import Link from "next/link";

import { getApiAgendas } from "@/generated/api";
import AgendaCard from "@/app/components/AgendaCard";
import CreateButton from "@/app/components/CreateButton";
import PageHeader from "@/app/components/PageHeader";

export default async function AgendasPage() {
  const response = await getApiAgendas();
  const agendas = response.data;

  const sortedAgendas = [...agendas].sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "", "nl", {
      sensitivity: "base",
    }),
  );

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
            href="/"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            ← Home
          </Link>
        </header>

        {/* Content */}
        <section className="py-16">
          <div className="flex items-start justify-between gap-6">
            <PageHeader
              eyebrow="Resource"
              title="Agendas"
              description="Een overzicht van alle beschikbare agenda's."
            />

            <CreateButton href="/agendas/new">
              Nieuwe agenda
            </CreateButton>
          </div>

          {sortedAgendas.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
              <h2 className="text-lg font-semibold text-foreground">
                Geen agenda's gevonden
              </h2>

              <p className="mt-2 text-sm text-muted">
                Er zijn momenteel geen agenda's beschikbaar.
              </p>

              <div className="mt-6">
                <CreateButton href="/agendas/new">
                  Eerste agenda maken
                </CreateButton>
              </div>
            </div>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {sortedAgendas.map((agenda) => (
                <AgendaCard
                  key={agenda.id}
                  agenda={agenda}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}